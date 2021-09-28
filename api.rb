require 'webrick'
require 'json'
require 'securerandom'
require 'yaml'

class ChecklistItemStore
  attr :items

  def initialize(server)
    @server = server
    @items = File.exist?('items.yml') ? YAML.load_file('items.yml') : []

    seed_data if @items.empty?
  end

  def item_for_index(idx)
    @items[idx]
  end

  def index_for_item(item)
    index_for_item_id(item[:id])
  end

  def index_for_item_id(id)
    @items.find_index { |i| i[:id] == id }
  end

  def add_item(input)
    item = item_hash_from_input(input)
    @items << item
    persist
    item
  end

  def update_item(idx, input)
    existing = item_for_index(idx)
    @items[idx] = item = item_hash_from_input(input, existing)
    persist
    item
  end

  def remove_item(idx)
    item = @items.delete_at(idx)
    persist
    item
  end

  def reset!
    @items = []
    seed_data
  end

  private

  def uuid
    SecureRandom.uuid.gsub('-', '')
  end

  def item_hash_from_input(input, item = nil)
    attributes = JSON.parse(input, symbolize_names: true)
    valid_keys = item.nil? ? %i[provider model serial] : %i[assigned_to completed_by status]

    attributes.each do |key, _|
      raise 'Invalid attributes' unless valid_keys.include?(key)
    end

    attributes.select! { |key, _| valid_keys.include?(key) }
    now = Time.now.utc.iso8601
    if item.nil?
      return {
        id: uuid,
        provider: nil,
        model: nil,
        serial: nil,
        status: 'unassigned',
        assigned_at: nil,
        assigned_to: nil,
        completed_at: nil,
        completed_by: nil,
        created_at: now,
        updated_at: now
      }.merge!(attributes)
    end

    attributes[:updated_at] = now

    if attributes[:status] == 'unassigned'
      attributes[:assigned_at] = nil
      attributes[:assigned_to] = nil
      attributes[:completed_at] = nil
      attributes[:completed_by] = nil
    elsif attributes[:status] == 'assigned'
      if attributes[:assigned_to].to_s.empty?
        raise 'assigned_to is required if status is unassigned'
      end
      attributes[:assigned_at] = now
      attributes[:completed_at] = nil
      attributes[:completed_by] = nil
    elsif attributes[:status] == 'completed'
      if attributes[:completed_by].to_s.empty?
        raise 'completed_by is required if status is completed'
      end
      attributes[:completed_at] = now
    end

    {
      id: item[:id],
      provider: item[:provider],
      model: item[:model],
      serial: item[:serial],
      status: item[:status],
      assigned_at: item[:assigned_at],
      assigned_to: item[:assigned_to],
      completed_at: item[:completed_at],
      completed_by: item[:completed_by],
      created_at: item[:created_at],
      updated_at: item[:updated_at]
    }.merge(attributes)
  end

  def seed_data
    models = [
      'iPad Air 2',
      'iPad Air (3rd generation)',
      'iPad (5th generation)',
      'iPad (6th generation)',
      'iPad Pro (11-inch)',
      'iPad Pro (12.9-inch)'
    ]
    providers = [
      'Jamie K', 'Alison E', 'Saul B', 'Cody G', 'Thalia S',
      'Brendan F', 'Abbey L', 'Kory T', 'Diego R', 'Graham N',
      'Annette P', 'Dorothy M', 'Jay D', 'Kirk H', 'Cherilyn V'
    ]
    reviewers = ['Eli B', 'Noel A', 'Sarah T', 'Dustin C', 'Jane H']
    statuses = %w(unassigned assigned completed)
    # seed items
    50.times do |i|
      parts = SecureRandom.uuid.split('-')
      serial = i.even? ? "#{parts[2]}#{parts[0]}" : "#{parts[3]}#{parts[1]}#{parts[4]}"
      status = statuses.sample

      # created at
      now = Time.now.utc
      extra_seconds = SecureRandom.random_number(60)
      # min 12 hours old, max 2 weeks + a few seconds
      created_seconds = (SecureRandom.random_number(11_664_00) + 43_200) # min 12 hours old to max 2 weeks old
      created_at = now - created_seconds - extra_seconds

      # min 8 hours, max 12 hours + a few seconds
      assigned_seconds = SecureRandom.random_number(43_200) + 28_800 + extra_seconds
      assigned_at = status != 'unassigned' ? created_at + assigned_seconds : nil

      # min 4 hours, max 8 hours + a few seconds
      completed_seconds = SecureRandom.random_number(28_800) + 14_400 + extra_seconds
      completed_at = status == 'completed' ? assigned_at + completed_seconds : nil

      created_at_timestamp = created_at.iso8601
      assigned_at_timestamp = assigned_at&.iso8601
      completed_at_timestamp = completed_at&.iso8601
      updated_at_timestamp = created_at_timestamp
      updated_at_timestamp = assigned_at_timestamp if status == 'assigned'
      updated_at_timestamp = completed_at_timestamp if status == 'completed'

      reviewer = reviewers.sample
      @items << {
          id: uuid,
          provider: providers.sample,
          model: models.sample,
          serial: serial,
          status: status,
          assigned_at: assigned_at_timestamp,
          assigned_to: status != 'unassigned' ? reviewer : nil,
          completed_at: completed_at_timestamp,
          completed_by: status == 'completed' ? reviewer : nil,
          created_at: created_at_timestamp,
          updated_at: updated_at_timestamp
      }
    end

    persist
  end

  def persist
    File.write('items.yml', @items.to_yaml)
  end
end

class ChecklistItemsRestfulServlet < WEBrick::HTTPServlet::AbstractServlet
  attr :store

  def initialize(server, store)
    super server
    @store = store
    @response_type = 'application/json'
  end

  def do_GET(request, response)
    begin
      response_formatter(response, 200, store.items)
    rescue => e
      error_response(response, e)
    end
  end

  def do_POST(request, response)
    begin
      item = @store.add_item(request.body)
      response_formatter(response, 201, item)
     rescue => e
       error_response(response, e)
    end
  end

  def do_PATCH(request, response)
    begin
      id = parse_uuid(request)
      return response_formatter(response, 400, error: 'Bad Request') if id.nil?

      idx = @store.index_for_item_id(id)
      if idx.nil?
        response_formatter(response, 404, error: 'Not Found')
      else
        item = @store.update_item(idx, request.body)

        response_formatter(response, 200, item)
      end
    rescue => e
      error_response(response, e)
    end
  end

  def do_DELETE(request, response)
    begin
      id = parse_uuid(request)
      return response_formatter(response, 400, error: 'Bad Request') if id.nil?

      idx = @store.index_for_item_id(id)
      if idx.nil?
        response_formatter(response, 404, error: 'Not Found')
      else
        item = @store.remove_item(idx)

        response_formatter(response, 200, item)
      end
    rescue => e
      error_response(response, e)
    end
  end

  def do_OPTIONS(request, response)
    return preflight_formatter(response)
  end

  private

  def parse_uuid(request)
    request.path.gsub('/checklist_items/','') rescue nil
  end

  def preflight_formatter(response)
    response['Access-Control-Allow-Origin'] = '*'
    response['Access-Control-Allow-Methods'] = 'GET, OPTIONS, PATCH'
    response['Access-Control-Request-Method'] = '*'
    response['Access-Control-Allow-Headers'] = 'Origin, X-Requested-With, Content-Type, Accept, Authorization'
    response.status = 200
    response.body = nil
  end

  def response_formatter(response, status, result)
    response['Access-Control-Allow-Origin'] = '*'
    response['Server'] = 'Deep Structure - Checklist Items API v1.0'
    response['Content-Type'] = @response_type
    response.status = status
    response.body = JSON.generate(result)
  end

  def error_response(response, e)
    response_formatter(response, 500, error: e.message)
  end
end

server = WEBrick::HTTPServer.new(Port: 8000)

store = ChecklistItemStore.new(server)
server.mount '/checklist_items', ChecklistItemsRestfulServlet, store
server.mount_proc '/reset' do |request, response|
  store.reset!

  response['Access-Control-Allow-Origin'] = '*'
  response['Server'] = 'Deep Structure - Checklist Items API v1.0'
  response['Content-Type'] = @response_type
  response.status = 200
  response.body = JSON.generate([])
end

trap('INT') do
  server.shutdown
end

server.start
