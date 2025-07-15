# Database Schema & API Planning - Fitness Event Management System

## Overview

This document outlines the database schema and API planning for the Fitness Event Management System, which allows users to participate in fitness events with mandatory health checkups.

## Database Schema Summary

### Core Tables

#### 1. **users** (Existing + Enhanced)

```sql
- id: VARCHAR(50) PRIMARY KEY
- username: VARCHAR(50) UNIQUE NOT NULL
- password: TEXT NOT NULL
- fullname: TEXT NOT NULL
- role: VARCHAR(20) NOT NULL DEFAULT 'member' -- admin, staff, member
```

**Purpose**: Core user management with application-level roles

#### 2. **events** (New)

```sql
- id: VARCHAR(50) PRIMARY KEY
- name: TEXT NOT NULL
- date: TIMESTAMP NOT NULL
- description: TEXT
```

**Purpose**: Store fitness events that users can participate in

#### 3. **event_participants** (New - Junction Table)

```sql
- id: VARCHAR(50) PRIMARY KEY
- event_id: VARCHAR(50) → events.id
- user_id: VARCHAR(50) → users.id
- participant_code: VARCHAR(20) UNIQUE NOT NULL -- P001, O001, I001, etc.
- role: VARCHAR(20) NOT NULL -- participant, organizer, instructor, medical_staff, volunteer
- registration_date: TIMESTAMP DEFAULT NOW()
- status: VARCHAR(20) DEFAULT 'registered' -- registered, confirmed, checked_in, completed, cancelled, no_show
- notes: TEXT
```

**Purpose**: Links users to events with specific roles and unique codes

#### 4. **participant_checkups** (New)

```sql
- id: VARCHAR(50) PRIMARY KEY
- event_id: VARCHAR(50) → events.id
- user_id: VARCHAR(50) → users.id
- checkup_date: TIMESTAMP DEFAULT NOW()
- blood_pressure_systolic: INTEGER
- blood_pressure_diastolic: INTEGER
- heart_rate: INTEGER
- weight: DECIMAL(5,2)
- height: DECIMAL(5,2)
- medical_conditions: TEXT
- medications: TEXT
- fitness_level: VARCHAR(20) -- beginner, intermediate, advanced
- is_approved: BOOLEAN DEFAULT FALSE
- approval_notes: TEXT
- checked_by: VARCHAR(100)
```

**Purpose**: Store medical checkup data for event participants

#### 5. **checkup_results** (New)

```sql
- id: VARCHAR(50) PRIMARY KEY
- participant_checkup_id: VARCHAR(50) → participant_checkups.id
- result_status: VARCHAR(20) NOT NULL -- allowed, allowed_with_note, declined
- organizer_notes: TEXT
- health_concerns: TEXT
- restrictions: TEXT
- recommendations: TEXT
- reviewed_by: VARCHAR(50) → users.id
- reviewed_at: TIMESTAMP DEFAULT NOW()
```

**Purpose**: Store organizer decisions on checkup approvals (separate from raw medical data)

#### 6. **checkup_reviewers** (New)

```sql
- id: VARCHAR(50) PRIMARY KEY
- user_id: VARCHAR(50) → users.id
- reviewer_type: VARCHAR(20) -- medical_professional, event_organizer, fitness_instructor, admin
- license_number: VARCHAR(100)
- specialization: VARCHAR(100)
- years_of_experience: INTEGER
- certification: TEXT
- institution: VARCHAR(200)
- contact_phone: VARCHAR(20)
- contact_email: VARCHAR(100)
- is_active: BOOLEAN DEFAULT TRUE
- authorized_events: TEXT -- JSON array of event IDs
- approval_authority_level: INTEGER DEFAULT 1 -- 1=basic, 2=intermediate, 3=advanced
- notes: TEXT
```

**Purpose**: Store information about users authorized to review medical checkups

### Legacy Tables (Existing)

- albums, songs, playlists, playlist_songs, authentications, collaborations, etc.

## API Planning

### 1. **Events API**

```
POST   /events                    # Create new event (staff/admin only)
GET    /events                    # List all events
GET    /events/{id}               # Get event details
PUT    /events/{id}               # Update event (staff/admin only)
DELETE /events/{id}               # Delete event (admin only)
```

### 2. **Event Participants API**

```
POST   /events/{eventId}/participants              # Register for event
GET    /events/{eventId}/participants              # List event participants
GET    /events/{eventId}/participants/{userId}     # Get participant details
PUT    /events/{eventId}/participants/{userId}     # Update participant status
DELETE /events/{eventId}/participants/{userId}     # Remove participant

# Participant code management
GET    /events/{eventId}/participants/{userId}/code    # Get participant code
POST   /events/{eventId}/generate-codes                # Generate codes for all participants
```

### 3. **Medical Checkups API**

```
# Checkup data submission
POST   /events/{eventId}/checkups                  # Submit checkup data
GET    /events/{eventId}/checkups                  # List checkups for event
GET    /events/{eventId}/checkups/{userId}         # Get user's checkup
PUT    /events/{eventId}/checkups/{userId}         # Update checkup data
DELETE /events/{eventId}/checkups/{userId}         # Delete checkup

# Checkup results (organizer decisions)
POST   /checkups/{checkupId}/results               # Submit checkup decision
GET    /checkups/{checkupId}/results               # Get checkup decision
PUT    /checkups/{checkupId}/results               # Update decision
```

### 4. **Checkup Reviewers API**

```
POST   /reviewers                                  # Create reviewer profile
GET    /reviewers                                  # List all reviewers
GET    /reviewers/{id}                             # Get reviewer details
PUT    /reviewers/{id}                             # Update reviewer
DELETE /reviewers/{id}                             # Deactivate reviewer

# Reviewer assignments
POST   /events/{eventId}/reviewers                 # Assign reviewer to event
GET    /events/{eventId}/reviewers                 # List event reviewers
DELETE /events/{eventId}/reviewers/{reviewerId}    # Remove reviewer from event
```

### 5. **User Management API** (Enhanced)

```
POST   /users                                      # Register user
GET    /users                                      # List users (admin/staff only)
GET    /users/{id}                                 # Get user profile
PUT    /users/{id}                                 # Update user profile
PUT    /users/{id}/role                            # Change user role (admin only)
DELETE /users/{id}                                 # Delete user (admin only)

# User's event history
GET    /users/{id}/events                          # Get user's events
GET    /users/{id}/checkups                        # Get user's checkup history
```

### 6. **Authentication API** (Existing)

```
POST   /authentications                            # Login
PUT    /authentications                            # Refresh token
DELETE /authentications                            # Logout
```

## Role-Based Access Control

### Application Roles (users.role)

- **admin**: Full system access
- **staff**: Can manage events, review checkups
- **member**: Can participate in events

### Event Roles (event_participants.role)

- **participant**: Regular event participant
- **organizer**: Event organizer
- **instructor**: Fitness instructor
- **medical_staff**: Medical personnel
- **volunteer**: Event volunteer

### Permission Matrix

| Action                | Admin | Staff | Member |
| --------------------- | ----- | ----- | ------ |
| Create Events         | ✅    | ✅    | ❌     |
| Delete Events         | ✅    | ❌    | ❌     |
| Review Checkups       | ✅    | ✅    | ❌     |
| Participate in Events | ✅    | ✅    | ✅     |
| Submit Checkups       | ✅    | ✅    | ✅     |
| Manage Users          | ✅    | ❌    | ❌     |

## Code Generation Logic

### Participant Codes

- **Format**: `{ROLE_PREFIX}{EVENT_ID_SUFFIX}{SEQUENCE}`
- **Examples**:
  - Participant: `P001`, `P002`, `P003`
  - Organizer: `O001`, `O002`
  - Instructor: `I001`, `I002`
  - Medical Staff: `M001`, `M002`
  - Volunteer: `V001`, `V002`

### Code Generation Algorithm

```javascript
function generateParticipantCode(role, eventId) {
  const prefixes = {
    participant: "P",
    organizer: "O",
    instructor: "I",
    medical_staff: "M",
    volunteer: "V",
  };

  const prefix = prefixes[role];
  const sequence = getNextSequenceForEventAndRole(eventId, role);
  return `${prefix}${sequence.toString().padStart(3, "0")}`;
}
```

## Migration Timeline

1. `1752580127000` - Create events table
2. `1752580208717` - Create participant_checkups table
3. `1752580470313` - Create checkup_results table
4. `1752580556639` - Create checkup_reviewers table
5. `1752583849154` - Create event_participants table
6. `1752583957509` - Add role to users table

## Next Steps

### Phase 1: Core Implementation

1. Implement Events API
2. Implement Event Participants API
3. Add participant code generation logic

### Phase 2: Health Management

1. Implement Medical Checkups API
2. Implement Checkup Results API
3. Add automated health screening rules

### Phase 3: Advanced Features

1. Implement Checkup Reviewers API
2. Add role-based permissions
3. Add notification system
4. Add reporting and analytics

### Phase 4: Enhancements

1. Add email notifications
2. Add file upload for medical documents
3. Add event capacity management
4. Add waiting list functionality
