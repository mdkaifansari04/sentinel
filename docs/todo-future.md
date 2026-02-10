# Future TODOs

- Add retention job to delete events older than 90 days.
- Add pagination handling for repositories with high event volume.
- Store a per-repo cursor (etag or last seen event id) to reduce API calls.
- Add summarized rollups for hourly activity (AI/RAG summary pipeline).
