# Jobly
Jobly is a job board platform with features for both candidates and recruiters.

## Features 
### Candidates
* Candidates can create and manage their profile.
* Candidates can apply for vacancies.
* Candidates can filter vacancies by skills, category and salary
* Candidates can get recommendations for vacancies based on their skills, category, salary expectations and experience(calculated using cosine similarity and other coefficients).

### Recruiters 
* Recruiters can create and manage their profile.
* Recruiters can create vacancies.
* Recruiters can view lists of candidates who have applied for a vacancy. It is also possible to sort these applications by "quality" (calculated using cosine similarity and other coefficients) and time of submission.

## How to Build and Run

1. Make sure Docker and Docker Compose are installed on your machine.
2. Clone this repository and navigate into the root directory of this project.
3. Rename the file `.env.sample` to `.env` and adjust the variables as needed based on your environment.
4. Execute the following command to build and run the application:

For running on localhost:
```bash
docker-compose up
````

For running in a production setup:

```bash
docker-compose -f docker-compose-deploy.yml up
```
