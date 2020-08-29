package proxy

import play.api.Logging
import play.api.http.HeaderNames._
import play.api.http.MimeTypes._
import play.api.mvc.Result
import play.api.mvc.Results.{BadGateway, Status}

import scala.concurrent.{ExecutionContext, Future}

case class ProxyResult(response: ProxyResponse)

object ProxyResult extends Logging {
  private def asResult(proxyResult: ProxyResult): Result = {
    val resultHeaders = Seq(
      proxyResult.response.header(CONTENT_LENGTH).map(CONTENT_LENGTH -> _)
    ).flatten

    Status(proxyResult.response.status)
      .chunked(proxyResult.response.bodyAsSource)
      .withHeaders(resultHeaders: _*)
      .as(proxyResult.response.header(CONTENT_TYPE).getOrElse(TEXT))
  }

  def apply(proxyResult: Future[ProxyResult])(implicit ec: ExecutionContext) = proxyResult.map(ProxyResult.asResult)
}
