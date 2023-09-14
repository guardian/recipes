addSbtPlugin("com.typesafe.play" % "sbt-plugin" % "2.8.8")

addSbtPlugin("com.eed3si9n" % "sbt-buildinfo" % "0.10.0")

addSbtPlugin("com.gu" % "sbt-riffraff-artifact" % "1.1.9")

libraryDependencies += "org.vafer" % "jdeb" % "1.7" artifacts Artifact("jdeb", "jar", "jar")

ThisBuild / libraryDependencySchemes += "org.scala-lang.modules" %% "scala-xml" % VersionScheme.Always
