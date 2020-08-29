package proxy

import akka.stream.scaladsl.Source
import akka.util.ByteString
import play.api.libs.ws.WSResponse

class ProxyResponse(response: WSResponse) {
  def allHeaders: Map[String, collection.Seq[String]] = response.headers

  val status: Int = response.status

  def header(name: String): Option[String] =
    allHeaders.get(name).map(_.head)

  def bodyAsSource: Source[ByteString, _] = response.bodyAsSource

  override def toString = s"ProxyResponse($status, $allHeaders)"
}
