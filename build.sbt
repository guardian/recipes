import com.typesafe.sbt.packager.archetypes.systemloader.ServerLoader.Systemd

val enumeratumVersion = "1.6.1"
val jacksonVersion = "2.11.4"
val logstashLogbackVersion = "7.0.1"
val awsSdkVersion = "1.11.851"

lazy val root = (project in file("."))
  .enablePlugins(PlayScala, JDebPackaging, SystemdPlugin)
  .settings(Seq(
    name := """recipes""",
    version := "1.0-SNAPSHOT",
    scalaVersion := "2.13.1",

    PlayKeys.playDefaultPort := 9090,
    
    libraryDependencies ++= Seq(
      ws,
      "org.scalatestplus.play" %% "scalatestplus-play" % "5.0.0" % Test,
      "com.beachape" %% "enumeratum" % enumeratumVersion,
      "com.beachape" %% "enumeratum-play" % enumeratumVersion,
      "com.fasterxml.jackson.core" % "jackson-databind" % jacksonVersion,

      // logstash-logback-encoder brings in version 2.11.0
      // exclude transitive dependency to avoid a runtime exception:
      // `com.fasterxml.jackson.databind.JsonMappingException: Scala module 2.10.2 requires Jackson Databind version >= 2.10.0 and < 2.11.0`
      "net.logstash.logback" % "logstash-logback-encoder" % logstashLogbackVersion exclude("com.fasterxml.jackson.core", "jackson-databind"),
      "com.gu" % "kinesis-logback-appender" % "1.4.4",
      "com.gu" %% "pan-domain-auth-verification" % "1.0.6",
      "com.amazonaws" % "aws-java-sdk-s3" % awsSdkVersion,
      "com.amazonaws" % "aws-java-sdk-dynamodb" % awsSdkVersion,
      "com.gu" %% "simple-configuration-s3" % "1.5.6"
    ),
    scalacOptions ++= List(
      "-encoding", "utf8",
      "-deprecation",
      "-feature",
      "-unchecked",
      "-Xfatal-warnings"
    ),
    dependencyOverrides ++= Seq(
    "com.fasterxml.jackson.core" % "jackson-databind" % jacksonVersion,
    ),
    Universal / javaOptions ++= Seq(
      s"-Dpidfile.path=/dev/null",
      "-J-XX:MaxRAMFraction=2",
      "-J-XX:InitialRAMFraction=2",
      "-J-XX:MaxMetaspaceSize=300m",
      "-J-XX:+PrintGCDetails",
      "-J-XX:+PrintGCDateStamps",
      s"-J-Dlogs.home=/var/log/${packageName.value}",
      s"-J-Xloggc:/var/log/${packageName.value}/gc.log",
      "-Dconfig.file=/etc/gu/recipes.conf"
    ),
    Test / javaOptions += "-Dconfig.file=conf/application.test.conf",
        /* A debian package needs some mandatory settings to be valid */
    maintainer := "Basecamp",
    Debian / packageSummary := "Recipes UI play app",
    Debian / packageDescription := "Recipes UI play app",
    Debian / packageBin := (Debian / packageBin)
      .dependsOn(Assets / packageBin)
      .value,
    /* Use systemd to load this service */
    Debian / serverLoading := Some(Systemd),
    Debian / serviceAutostart := true,
    /* Configure the Java options with which the executable will be launched */
    Universal / javaOptions ++= Seq(
      // Remove the PID file
      "-Dpidfile.path=/dev/null"
    )
))
