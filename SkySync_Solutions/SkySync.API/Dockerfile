FROM mcr.microsoft.com/dotnet/sdk:10.0-preview AS build
WORKDIR /src

COPY SkySync.API/SkySync.API.csproj SkySync.API/
COPY SkySync.Application/SkySync.Application.csproj SkySync.Application/
COPY SkySync.Domain/SkySync.Domain.csproj SkySync.Domain/
COPY SkySync.Infrastructure/SkySync.Infrastructure.csproj SkySync.Infrastructure/

RUN dotnet restore SkySync.API/SkySync.API.csproj

COPY . .
WORKDIR /src/SkySync.API
RUN dotnet publish SkySync.API.csproj -c Release -o /app/publish /p:UseAppHost=false

FROM mcr.microsoft.com/dotnet/aspnet:10.0-preview AS final
WORKDIR /app
ENV ASPNETCORE_URLS=http://+:8080
EXPOSE 8080
COPY --from=build /app/publish .
ENTRYPOINT ["dotnet", "SkySync.API.dll"]
