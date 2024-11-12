# Stage 1: Compile the Java files
FROM openjdk:16 AS build

# Create directories for RIA and pure-HTML classes
WORKDIR /app
RUN mkdir -p /app/RIA/classes /app/pure-HTML/classes

# Copy java source files for RIA and pure-HTML
COPY RIA/src/main/java /app/RIA/src
COPY pure-HTML/src/main/java /app/pure-HTML/src

# Copy the HTML, JS, and other assets into the webapp directories
COPY RIA/src/main/webapp /app/RIA/webapp
COPY pure-HTML/src/main/webapp /app/pure-HTML/webapp

# Copy the WEB-INF/lib JARs from RIA and pure-HTML into the build stage
COPY RIA/src/main/webapp/WEB-INF/lib /app/RIA/lib
COPY pure-HTML/src/main/webapp/WEB-INF/lib /app/pure-HTML/lib

# Compile RIA Java files with the servlet API JAR in the classpath
RUN javac -classpath "/app/RIA/lib/*" -d /app/RIA/classes /app/RIA/src/**/*.java

# Compile pure-HTML Java files with the servlet API JAR in the classpath
RUN javac -classpath "/app/pure-HTML/lib/*" -d /app/pure-HTML/classes /app/pure-HTML/src/**/*.java

# Stage 2: Set up Tomcat and deploy compiled classes
FROM tomcat:9.0-jdk16

# Copy the compiled classes to Tomcat webapps directories
COPY --from=build /app/RIA/classes /usr/local/tomcat/webapps/ria/WEB-INF/classes
COPY --from=build /app/pure-HTML/classes /usr/local/tomcat/webapps/pure/WEB-INF/classes

# Copy HTML, JS, and other assets to the Tomcat webapps directory
COPY --from=build /app/RIA/webapp /usr/local/tomcat/webapps/ria
COPY --from=build /app/pure-HTML/webapp /usr/local/tomcat/webapps/pure

# Copy web.xml files to configure servlets
COPY RIA/src/main/webapp/WEB-INF/web.xml /usr/local/tomcat/webapps/ria/WEB-INF/web.xml
COPY pure-HTML/src/main/webapp/WEB-INF/web.xml /usr/local/tomcat/webapps/pure/WEB-INF/web.xml

# Expose the Tomcat port
EXPOSE 8080
