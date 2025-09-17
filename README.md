🎯 Business Requirements: Ticketing System

1. Objective
    To design and implement a centralized ticketing system that enables users to submit, track, and manage support or service requests  efficiently. The system should streamline communication between requesters and support teams, improve resolution times, and provide  transparency across all ticket statuses.

2. Key Features & Functional Requirements
    📝 Ticket Creation
        - Users can create tickets via web interface or email.
        - Required fields: Subject, Description, Category, Priority, Attachments (optional).
        - Auto-assign ticket ID upon creation.

    📊 Ticket Dashboard
        - Users and agents can view ticket status (Open, In Progress, Resolved, Closed).
        - Filters by date, category, priority, and assigned agent.
        - Search functionality by ticket ID or keywords.

    👥 User Roles & Permissions
        - Role	Capabilities
        - Requester	Create/view own tickets, comment, close resolved tickets
        - Agent	View/assign tickets, update status, comment, escalate
        - Admin	Full access, manage users, configure categories, generate reports

    🔄 Ticket Lifecycle
        - Status flow: Open → In Progress → Resolved → Closed
        - Agents can reassign or escalate tickets.
        - Requesters can reopen resolved tickets within a defined time window.

    📬 Notifications
        - Email alerts for ticket creation, status updates, comments, and resolution.
        - Configurable notification preferences per user.

    📈 Reporting & Analytics
        - Daily/weekly/monthly ticket volume reports.
        - SLA compliance tracking.
        - Agent performance metrics.

3. Non-Functional Requirements
    - System must support concurrent users (scalable to 10,000+).
    - Mobile-responsive UI.
    - Data encryption at rest and in transit.
    - 99.9% uptime SLA.
    
4. Success Metrics
    - 80% of tickets resolved within SLA.
    - 90% user satisfaction rating via post-resolution surveys.
    - Reduction in average resolution time by 30% within 3 months of launch.


# Node.js Dev Container

This is a simple starter for a Node.js Dev Container

## Getting started
1. Manually configure your own `.env` file from `.env.sample`
2. Run `./release.dev.sh` to check and generate the required files
3. Open in VS Code using Dev Containers
    - `Ctrl + Shift + P` type "Reopen in Dev Container"
    - Alternatively, run `docker compose -f compose.dev.yaml up`
      to start the development environment. Then, attach your editor
      to the `${PROJECT_NAME}-develop` container.
4. Initialize the database
    ```
    # Get the id of the postgres container
    docker ps

    # Go inside the container
    docker exec -it <container_id> bash

    # Connect to the database
    psql -U <app_user> -d <app_db>

    # Create a table
    CREATE TABLE Persons (
        PersonID int,
        LastName varchar(255),
        FirstName varchar(255),
        Age int
    );

    # Check if table is created
    \dt
    ```
5. Install the packages
    ```
    npm install
    ```
5. Start the Node.js server
    ```
    node src/server.js
    ```

## How it works
* `docker/dev/app.Dockerfile` defines the dev container
    * It is important to create a user in the container that matches the host user's UID:GID
    * This is to prevent permission issues from files created in the container
* `compose.dev.yaml` defines other services needed in the dev environment
    * The current directory is mounted to the container to persist files in the host machine
        * https://docs.docker.com/engine/storage/bind-mounts/
    * Exposes the default Node.js port `3000` so that the node.js server is accessible by the host
* `release.dev.sh` checks the `.env` file and initializes some needed files
    * `.bash_history` persists the history between rebuilds