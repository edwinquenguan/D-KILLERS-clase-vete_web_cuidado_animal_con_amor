# ---- Etapa de build ----
FROM maven:3.9-eclipse-temurin-21 AS build
WORKDIR /app
COPY pom.xml .
# Descarga dependencias en cache
RUN mvn -B dependency:go-offline -DskipTests || true
COPY src ./src
# Los tests viven fuera de la imagen; se compila el artefacto sin ejecutarlos
RUN mvn -B clean package -Dmaven.test.skip=true

# ---- Etapa de runtime ----
FROM eclipse-temurin:21-jre-jammy
WORKDIR /app
COPY --from=build /app/target/*.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]
