using TechHub.Application.Interfaces;
using TechHub.Application.Servicios;
using TechHub.Infrastructure;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

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

var connectionString = builder.Configuration.GetConnectionString("DefaultConnection")
    ?? builder.Configuration["Database:ConnectionString"]
    ?? "Host=localhost;Database=TechHubDB;Username=postgres;Password=12345";

builder.Services.AddDbContext<TechHubDbContext>(options =>
    options.UseNpgsql(connectionString));

builder.Services.AddScoped<IAgendaService, AgendaService>();
builder.Services.AddScoped<IVentasService, VentasService>();
builder.Services.AddScoped<IUsuariosService, UsuariosService>();
builder.Services.AddScoped<IMantenimientoService, MantenimientoService>();


var app = builder.Build();



if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();


    app.UseSwaggerUI(options =>
    {
        options.SwaggerEndpoint("/openapi/v1.json", "TechHub API");
    });
}

app.UseCors("PermitirAngular");

app.UseAuthorization();

app.MapControllers();

app.MapGet("/", () => Results.Redirect("/swagger"));

app.Run();