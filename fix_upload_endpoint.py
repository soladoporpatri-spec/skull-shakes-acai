# -*- coding: utf-8 -*-
with open('Backend/Endpoints/AdminEndpoints.cs', 'r', encoding='utf-8') as f:
    content = f.read()

upload_endpoint = '''
        admin.MapPost("/produtos/upload", async (HttpRequest req, IConfiguration config, ILogger<Program> logger) =>
        {
            if (!req.HasFormContentType) return Results.BadRequest("Invalid content type");
            
            var form = await req.ReadFormAsync();
            var file = form.Files.FirstOrDefault();
            if (file == null || file.Length == 0) return Results.BadRequest("No file uploaded");

            if (!file.ContentType.StartsWith("image/")) return Results.BadRequest("Only images allowed");

            var supabaseUrl = config["SUPABASE_URL"];
            var supabaseKey = config["SUPABASE_SERVICE_ROLE_KEY"] ?? config["SUPABASE_KEY"];

            if (string.IsNullOrEmpty(supabaseUrl) || string.IsNullOrEmpty(supabaseKey))
            {
                logger.LogError("Supabase URL or Key not configured");
                return Results.StatusCode(500);
            }

            var fileName = $"{Guid.NewGuid()}{Path.GetExtension(file.FileName)}";
            var requestUrl = $"{supabaseUrl}/storage/v1/object/produtos/{fileName}";
            
            using var httpClient = new HttpClient();
            httpClient.DefaultRequestHeaders.Add("Authorization", $"Bearer {supabaseKey}");
            httpClient.DefaultRequestHeaders.Add("apikey", supabaseKey);

            using var stream = file.OpenReadStream();
            using var streamContent = new StreamContent(stream);
            streamContent.Headers.ContentType = new System.Net.Http.Headers.MediaTypeHeaderValue(file.ContentType);

            var response = await httpClient.PostAsync(requestUrl, streamContent);
            var responseBody = await response.Content.ReadAsStringAsync();

            if (!response.IsSuccessStatusCode)
            {
                logger.LogError("Supabase Upload Error: {StatusCode} - {Body}", response.StatusCode, responseBody);
                return Results.StatusCode(502);
            }

            var publicUrl = $"{supabaseUrl}/storage/v1/object/public/produtos/{fileName}";
            return Results.Ok(new { url = publicUrl });
        }).DisableAntiforgery();

        admin.MapPost("/produtos",'''

content = content.replace('admin.MapPost("/produtos",', upload_endpoint)

with open('Backend/Endpoints/AdminEndpoints.cs', 'w', encoding='utf-8') as f:
    f.write(content)
