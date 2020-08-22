val enumeratumVersion = "1.6.1"
val enumeratumPlayVersion = "1.6.1"
val jacksonVersion = "2.10.5"
val logstashLogbackVersion = "6.4"

lazy val root = (project in file("."))
  .enablePlugins(PlayScala)
  .settings(
    name := """recipes""",
    version := "1.0-SNAPSHOT",
    scalaVersion := "2.13.1",
    libraryDependencies ++= Seq(
      "org.scalatestplus.play" %% "scalatestplus-play" % "5.0.0" % Test,
      "com.beachape" %% "enumeratum" % enumeratumVersion,
      "com.beachape" %% "enumeratum-play" % enumeratumPlayVersion,
      "com.fasterxml.jackson.core" % "jackson-databind" % jacksonVersion,

      // logstash-logback-encoder brings in version 2.11.0
      // exclude transitive dependency to avoid a runtime exception:
      // `com.fasterxml.jackson.databind.JsonMappingException: Scala module 2.10.2 requires Jackson Databind version >= 2.10.0 and < 2.11.0`
      "net.logstash.logback" % "logstash-logback-encoder" % logstashLogbackVersion exclude("com.fasterxml.jackson.core", "jackson-databind"),
    ),
    scalacOptions ++= List(
      "-encoding", "utf8",
      "-deprecation",
      "-feature",
      "-unchecked",
      "-Xfatal-warnings"
    ),
    javaOptions in Test += "-Dconfig.file=conf/application.test.conf"
  )

