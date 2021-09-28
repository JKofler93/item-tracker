# Deep Structure React Coding Exercise

## Background

In this coding exercise, let's imagine that Deep Structure plans to provide iPads to providers. We'd like you to update the prototype application to allow team members to manage checklist items for outgoing iPads using the fictional Checklist API.

## Checklist Manager and API

We've provided an initial React prototype that fetches all the items and allows you to reset.

At first run of the Checklist API, the server will generate 50 random checklist items. At any time, you can use the `Reset` button to remove existing items and generate 50 new items.

To get the app up and running, you'll need the default installation of Ruby on Mac OS, Node (version 14.16+) and Yarn. You'll do `yarn install` to install the dependencies for the app.

To start the API, you'll use `yarn start-api`. In a separate terminal, you'll use `yarn start` to run the React app.

The API will be available at `http://localhost:8000/checklist_items`.

While the API server is running, you can follow the request log to confirm that your requests are being received.

You can stop the server at any time, using `Ctrl-C`.

The React frontend will be available at `http://localhost:5000`

### Endpoints

A small REST API provides basic management of checklist items
- `GET /checklist_items` – an array of all checklist items
- `PATCH /checklist_items/:id` – update the checklist item (e.g. change status)

Checklist items have three possible `status` values:
 - `unassigned` – the initial state for all new items
 - `assigned` – indicates that a team member is working on this item (identified by the name in `assigned_to`)
 - `completed` – indicates that the item is resolved (identified by the name in `completed_by`)
 
### Checklist Item JSON

A checklist item will be represented in JSON like this:
```json
{
    "id": "d0b3819419df4db58b0a83907c55eb29",
    "provider": "Annette P",
    "model": "iPad Pro (12.9-inch)",
    "serial": "4d115f33037d",
    "status": "unassigned",
    "assigned_at": null,
    "assigned_to": null,
    "completed_at": null,
    "completed_by": null,
    "created_at": "2020-02-02T21:25:35Z",
    "updated_at": "2020-02-17T21:31:32Z"
}
```

- `id` (string) is the UUID that uniquely identifies the item
- `provider` (string) is the display name of the provider who will receive the iPad
- `model` (string) is the model name of the iPad
- `serial` (string) is the serial number of the iPad
- `status` (string, enum: `unassigned`, `assigned`, `completed`) is the current state of the item
- `assigned_at` (string, iso8601) timestamp when the item was assigned
- `assigned_to` (string) display name of the team member who is working on the item
- `completed_at` (string, iso8601) timestamp when the item was completed
- `closed_by` (string) display name of the team member who completed the item
- `created_at` (string, iso8601) timestamp when the item was generated
- `updated_at` (string, iso8601) timestamp when the item was updated

### Checklist Item Workflow

The typical checklist item workflow will resemble the following:

1. New item is created, `status = 'unassigned'`.
2. The item is assigned to a team member, `status = 'assigned'`.
3. The item is completed by a team member, `status = 'completed'`.

However, an item can move between states too.
 - An unassigned item has one action: `Assign To Me` 
 - An assigned item has two actions: `Unassign` and `Complete`
 - A completed item has one action: `Unassign`

#### Modifying Checklist Item Status

Using the `PATCH /checklist_items/:id` endpoint, you can change the status of an item to the desired state.

 - To set an item to assigned status, submit a PATCH request with `status` and `assigned_to` attributes:
     ```shell script
    curl --request PATCH \
      --url http://localhost:8000/checklist_items/d0b3819419df4db58b0a83907c55eb29 \
      --header 'content-type: application/json' \
      --data '{
        "status": "assigned",
        "assigned_to": "Sarah T"
    }'
    ```
    ```json
    {
      "id": "d0b3819419df4db58b0a83907c55eb29",
      "provider": "Annette P",
      "model": "iPad Pro (12.9-inch)",
      "serial": "4d115f33037d",
      "status": "assigned",
      "assigned_at": "2020-02-17T22:58:52Z",
      "assigned_to": "Sarah T",
      "completed_at": null,
      "completed_by": null,
      "created_at": "2020-02-02T21:25:35Z",
      "updated_at": "2020-02-17T22:58:52Z"
    }
    ```
  - To set an item to completed status, submit a PATCH request with `status` and `completed_by` attributes:
    ```shell script
    curl --request PATCH \
      --url http://localhost:8000/checklist_items/d0b3819419df4db58b0a83907c55eb29 \
      --header 'content-type: application/json' \
      --data '{
        "status": "completed",
        "completed_by": "Sarah T"
    }'
    ```
    ```json
    {
      "id": "d0b3819419df4db58b0a83907c55eb29",
      "provider": "Annette P",
      "model": "iPad Pro (12.9-inch)",
      "serial": "4d115f33037d",
      "status": "completed",
      "assigned_at": "2020-02-17T22:58:52Z",
      "assigned_to": "Sarah T",
      "completed_at": "2020-02-17T23:00:16Z",
      "completed_by": "Sarah T",
      "created_at": "2020-02-02T21:25:35Z",
      "updated_at": "2020-02-17T23:00:16Z"
    }
    ```
  - To set an item to unassigned status, submit a PATCH request with `status` attribute:
    ```shell script
    curl --request PATCH \
      --url http://localhost:8000/checklist_items/d0b3819419df4db58b0a83907c55eb29 \
      --header 'content-type: application/json' \
      --data '{
        "status": "unassigned"
    }'
    ```
    ```json
    {
      "id": "d0b3819419df4db58b0a83907c55eb29",
      "provider": "Annette P",
      "model": "iPad Pro (12.9-inch)",
      "serial": "4d115f33037d",
      "status": "unassigned",
      "assigned_at": null,
      "assigned_to": null,
      "completed_at": null,
      "completed_by": null,
      "created_at": "2020-02-02T21:25:35Z",
      "updated_at": "2020-02-17T23:01:00Z"
    }
    ```

#### Get All Checklist Items

To get all items, submit a GET request:
```shell script
curl --request GET \
  --url http://localhost:8000/checklist_items
```
```json
[
    {
        "id": "2e852074ccde459d91da16710aa5af9e",
        "provider": "Dorothy M",
        "model": "iPad Air (3rd generation)",
        "serial": "423fc5274a77",
        "status": "unassigned",
        "assigned_at": null,
        "assigned_to": null,
        "completed_at": null,
        "completed_by": null,
        "created_at": "2020-02-12T06:37:08Z",
        "updated_at": "2020-02-12T06:37:08Z"
     },
    {
        "id": "6d5b30b019194f3aadfdd2339626142e",
        "provider": "Thalia S",
        "model": "iPad Pro (11-inch)",
        "serial": "a76cb3cfef28df3fc7ae",
        "status": "assigned",
        "assigned_at": "2020-02-14T07:51:19Z",
        "assigned_to": "Dustin C",
        "completed_at": null,
        "completed_by": null,
        "created_at": "2020-02-13T17:17:48Z",
        "updated_at": "2020-02-14T07:51:19Z"
    },
    {
        "id": "c270978b42ab45e488bdbb63b647e428",
        "provider": "Jamie K",
        "model": "iPad (5th generation)",
        "serial": "4dec6dcab8aa",
        "status": "completed",
        "assigned_at": "2020-02-08T02:25:48Z",
        "assigned_to": "Noel A",
        "completed_at": "2020-02-08T13:54:20Z",
        "completed_by": "Noel A",
        "created_at": "2020-02-07T11:40:14Z",
        "updated_at": "2020-02-08T13:54:20Z"
    }
]
```

## Coding Exercise

Your goal is to build a checklist item manager – a prototype for team members which enables users to view and manage items through the workflow.

- You are free to use third-party components or open-source resources. When doing so, please provide a brief explanation for why you selected it.
- You are free to choose how best to implement your user interface to manage the workflow.
- You should make use of functional components and modern react techniques (e.g. hooks).

### Task 1: Checklist Workflow

Pretend that you will be showing this fictional prototype to potential customers (internal staff). As such, you should consider ease of use and attention to detail. To build out the checklist app, you need to implement a user interface that supports the checklist item workflow and interacts with the Checklist API.

For this exercise, assume that authentication has already been handled and the app will launch in an authenticated state, logged in as a team member named "Sarah T". When interacting with the API, you will always supply "Sarah T" as the team member where applicable.

With the above in mind, the team member must be able to:

- View a list of items
  - Each item must display the `provider`, `model`, `serial`, `status` and the appropriate timestamp:
    - Unassigned items should display the `created_at` timestamp
    - Assigned items should display the `assigned_at` timestamp
    - Completed items should display the `completed_at` timestamp
- Act on any item to change its `status` using the API
  - Unassigned item must have an `Assign To Me` action
  - Assigned items must have an `Unassign` and `Complete` actions
  - Completed items must have an `Unassign` action

### Task 2: Choose Your Enhancement

To further delight our team, we want to provide them with at least one additional feature. You are free to choose from any of the following options as an enhancement.

The team hopes to have one of these features in the prototype (not in any priority order): 

- Filter the list of items to a specific provider by name
- Filter the list of items to a specific status
- Visually distinguish between "Active" and "Completed" items
  - Active items are those which are in `unassigned` or `assigned` status
  - Completed items are those which are in `completed` status
- View all of the details for a specific item

### Submission

We expect that this exercise could take between 4 to 8 hours. Upon completion of the exercise, please package your source code into a zip file and send to [Dustin Steele](mailto:dustin.steele@deepstructure.ai).
