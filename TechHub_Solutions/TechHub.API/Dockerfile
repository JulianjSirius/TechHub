FROM mcr.microsoft.com/dotnet/sdk:10.0-preview AS build
WORKDIR /src

COPY . .
RUN dotnet restore "TechHub.API/TechHub.API.csproj"
RUN dotnet publish "TechHub.API/TechHub.API.csproj" -c Release -o /app/publish

FROM mcr.microsoft.com/dotnet/aspnet:10.0-preview AS runtime
WORKDIR /app
COPY --from=build /app/publish .
EXPOSE 8080
ENTRYPOINT ["dotnet", "TechHub.API.dll"]
