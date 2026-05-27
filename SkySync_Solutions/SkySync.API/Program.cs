using SkySync.Application.Interfaces;
using SkySync.Application.Servicios;
using SkySync.Infrastructure;
using Microsoft.EntityFrameworkCore;

AppContext.SetSwitch("Npgsql.EnableLegacyTimestampBehavior", true);

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddDbContext<SkySyncDbContext>(options =>
    options.UseNpgsql(builder.Configuration.GetConnectionString("DefaultConnection")
        ?? builder.Configuration["Database:ConnectionString"]
        ?? "Host=localhost;Database=SkySyncDB;Username=postgres;Password=12345"));

builder.Services.AddControllers();



builder.Services.AddCors(options =>
{
    options.AddPolicy("PermitirAngular", policy =>
    {
        policy.WithOrigins("http://localhost:4200")
              .AllowAnyHeader()
              .AllowAnyMethod();
    });
});
builder.Services.AddOpenApi();

builder.Services.AddScoped<IAgendaService, AgendaService>();
builder.Services.AddScoped<IUsuariosService, UsuariosService>();
builder.Services.AddScoped<IAeropuertosService, AeropuertosService>();
builder.Services.AddScoped<IAvionesService, AvionesService>();
builder.Services.AddScoped<IPilotosService, PilotosService>();
builder.Services.AddScoped<IVuelosService, VuelosService>();
builder.Services.AddScoped<IPracticasService, PracticasService>();
builder.Services.AddScoped<IHorasVueloService, HorasVueloService>();


var app = builder.Build();

using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<SkySyncDbContext>();
}

if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();


    app.UseSwaggerUI(options =>
    {
        options.SwaggerEndpoint("/openapi/v1.json", "SkySync API");
    });
}

app.UseCors("PermitirAngular");

app.UseAuthorization();

app.MapControllers();

app.MapGet("/", () => Results.Redirect("/swagger"));

app.Run();