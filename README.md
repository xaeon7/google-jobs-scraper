# Google Jobs Scraper API

![thumbnail](https://i.imgur.com/yoWDkNx.jpg)

This is an API for scraping job postings from Google Jobs. Currently, the API has one endpoint:

`/api/v1/jobs`

## Endpoint

### GET `/api/v1/jobs`

This endpoint accepts three query parameters:

- `searchQuery`: (string, required) The search query for the job postings.
- `location`: (string, optional) The location for the job postings. If not provided, defaults to the user's location.
- `resultsCount`: (number, optional) The number of job postings to return. If not provided, defaults to 10.

#### Response

The response is an array of job objects, each with the following properties:

- `id`: (string) The unique identifier for the job posting.
- `jobTitle`: (string) The title of the job posting.
- `logo`: (string, optional) The URL of the logo for the company posting the job.
- `companyName`: (string) The name of the company posting the job.
- `location`: (string) The location of the job.
- `extensions`: (string[]) An array of extension strings containing additional information about the job posting.

##### Example

```json
[
  {
    "id": "JP5wm9D1yg4AAAAAAAAAAA==",
    "jobTitle": "Front Office Python Support Engineer",
    "logo": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS4NoxNpwc1J84WwwuR4NYYwC7pfnMqO0RLIjlSDX8&s",
    "companyName": "Stanford Black",
    "location": "New York, NY",
    "extensions": ["2 days ago", "Full-time", "No degree mentioned"]
  },
  {
    "id": "tZFsOTpQEC4AAAAAAAAAAA==",
    "jobTitle": "Python SQL Developer",
    "companyName": "Infinity Consulting Solutions",
    "location": "Newark, NJ",
    "extensions": [
      "6 days ago",
      "Full-time",
      "Health insurance",
      "Dental insurance"
    ]
  },
  {
    "id": "T16aOMdM1ZgAAAAAAAAAAA==",
    "jobTitle": "Python Backend Developer",
    "logo": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSfVd_E5yL3HErwvmlniB4dIDxfuNxLatJ_AOG-jqQ&s",
    "companyName": "Bey",
    "location": "New York, NY",
    "extensions": ["20 hours ago", "Full-time", "No degree mentioned"]
  }
]
```

## Running the API

To run the API, clone the repository and run the following commands:

```bash
npm install
npm run dev
```

By default, the API runs on `http://localhost:5000`.
