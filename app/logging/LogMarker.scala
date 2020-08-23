package logging

import net.logstash.logback.marker.LogstashMarker
import net.logstash.logback.marker.Markers.appendEntries

import scala.jdk.CollectionConverters._
import scala.language.implicitConversions

trait LogMarker {
  def toLogMarker: LogstashMarker = appendEntries(markerContents.asJava)

  def markerContents: Map[String, Any]
}

case class MarkerMap(markerContents: Map[String, Any]) extends LogMarker

object MarkerMap {
  def apply(entries: (String, Any)*):MarkerMap = MarkerMap(entries.toMap)
}

trait MarkerUtils {
  val FALLBACK: String = "unknown"
  def combineMarkers(markers: LogMarker*): LogMarker = MarkerMap(markers.flatMap(_.markerContents.toSeq).toMap)
}
