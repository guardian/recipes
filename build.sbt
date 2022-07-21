import com.gu.riffraff.artifact.BuildInfo

val enumeratumVersion = "1.6.1"
val jacksonVersion = "2.11.4"
val logstashLogbackVersion = "7.0.1"
val awsSdkVersion = "1.11.851"

lazy val root = (project in file("."))
  .enablePlugins(PlayScala, RiffRaffArtifact, JDebPackaging, SystemdPlugin, BuildInfoPlugin)
  .settings(Seq(
    name := """recipes""",
    version := "1.0-SNAPSHOT",
    scalaVersion := "2.13.1",

    PlayKeys.playDefaultPort := 9090,

    riffRaffArtifactResources := Seq(
      (Debian / packageBin).value -> s"${name.value}/${name.value}.deb",
      baseDirectory.value / "riff-raff.yaml" -> "riff-raff.yaml",
      baseDirectory.value / "cloudformation.yaml" -> "cloudformation/recipes.cfn.yaml"
    ),

    buildInfoPackage := "recipes",
    buildInfoKeys := {
      lazy val buildInfo = BuildInfo(baseDirectory.value)
      Seq[BuildInfoKey](
        BuildInfoKey.sbtbuildinfoConstantEntry("buildNumber", buildInfo.buildIdentifier),
        // so this next one is constant to avoid it always recompiling on dev machines.
        // we only really care about build time on teamcity, when a constant based on when
        // it was loaded is just fine
        BuildInfoKey.sbtbuildinfoConstantEntry("buildTime", System.currentTimeMillis),
        BuildInfoKey.sbtbuildinfoConstantEntry("gitCommitId", buildInfo.revision)
      )
    },
    buildInfoOptions:= Seq(
      BuildInfoOption.Traits("management.BuildInfo"),
      BuildInfoOption.ToJson
    ),

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
    Test / javaOptions += "-Dconfig.file=conf/application.test.conf"
  ))
