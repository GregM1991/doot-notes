<details><summary>Build steps</summary>

## Building

To create a production version of your app:

```bash
npm run build
```

You can preview the production build with `npm run preview`.

> To deploy your app, you may need to install an
> [adapter](https://kit.svelte.dev/docs/adapters) for your target environment.

</details>

## Images

The decision to place images in the `src/lib/images` folder is due to vites
adding of hashes to the filename at compile time. The hash is based on image
contents so when the file is changed so is the hash, which allows the server to
send a very long cache expiration to the browser, so it can cache it forever or
until it changes (key-based cache expiration). See a full explanation in the top
answer here
https://stackoverflow.com/questions/71789244/where-to-put-images-with-sveltekit.

### Video

Below is a squence diagram showing the flow of uploading a video:

```mermaid
sequenceDiagram
    participant Client
    participant EditNote as EditNote.svelte
    participant VideoEditor as VideoEditor.svelte
    participant BrowserHandler as BrowserVideoHandler
    participant NewOrUpdate as newOrUpdate.server.ts
    participant Handler as handleNewOrUpdateVideo
    participant VideoProcessor as VideoUploadProcessor
    participant API as API Endpoints
    participant R2 as Cloudflare R2
    participant DB as Database

    Client->>EditNote: Selects video file
    EditNote->>VideoEditor: Passes file input
    VideoEditor->>BrowserHandler: Creates handler for preview
    BrowserHandler-->>VideoEditor: Returns preview thumbnail

    Client->>EditNote: Submits form
    EditNote->>NewOrUpdate: POST form data
    NewOrUpdate->>Handler: Process video

    Handler->>VideoProcessor: Initialize processor

    VideoProcessor->>API: POST /api/video/initialize-upload
    API->>R2: Creates multipart upload
    R2-->>API: Returns uploadId
    API-->>VideoProcessor: Returns uploadId

    loop For each chunk
        VideoProcessor->>API: POST /api/video/get-upload-url
        API-->>VideoProcessor: Returns presigned URL
        VideoProcessor->>R2: Uploads chunk via presigned URL
    end

    VideoProcessor->>API: POST /api/video/complete-upload
    API->>R2: Completes multipart upload
    R2-->>API: Confirms completion

    VideoProcessor->>API: POST /api/thumbnail/upload
    API->>R2: Stores thumbnail
    R2-->>API: Confirms thumbnail storage

    VideoProcessor-->>Handler: Returns video metadata & keys
    Handler-->>NewOrUpdate: Returns processed video data

    NewOrUpdate->>DB: Stores note with video data
    DB-->>NewOrUpdate: Confirms storage
    NewOrUpdate-->>Client: Redirects to note view
```
