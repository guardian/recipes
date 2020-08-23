package filter

import akka.stream.Materializer
import logging._
import play.api.Logging
import play.api.mvc.{Filter, RequestHeader, Result}

import scala.concurrent.{ExecutionContext, Future}
import scala.util.{Failure, Success}

class RequestLoggingFilter(override val mat: Materializer) extends Filter with Logging {
  private implicit val ec: ExecutionContext = ExecutionContext.Implicits.global

  override def apply(f: RequestHeader => Future[Result])(rh: RequestHeader): Future[Result] = {
    val stopwatch = Stopwatch.start
    val result = f(rh)

    result onComplete {
      case Success(response) => logSuccess(rh, response, stopwatch.elapsed)
      case Failure(exception) => logFailure(rh, exception, stopwatch.elapsed)
    }

    result
  }

  private def logSuccess(request: RequestHeader, response: Result, elapsed: DurationForLogging): Unit = {
    val originIp = request.headers.get("X-Forwarded-For").getOrElse(request.remoteAddress)
    val referer = request.headers.get("Referer").getOrElse(FALLBACK)
    val length = response.header.headers.getOrElse("Content-Length", 0)

    val markers = combineMarkers(
      MarkerMap(
        "origin" -> originIp,
        "referer" -> referer,
        "method" -> request.method,
        "status" -> response.header.status,
        "length" -> length
      ),
      elapsed
    )

    logger.info(s"""$originIp - "${request.method} ${request.uri} ${request.version}" ${response.header.status} $length "$referer" ${elapsed.toMillis}ms""")(markers.toLogMarker)
  }

  private def logFailure(request: RequestHeader, throwable: Throwable, elapsed: DurationForLogging): Unit = {
    val originIp = request.headers.get("X-Forwarded-For").getOrElse(request.remoteAddress)
    val referer = request.headers.get("Referer").getOrElse(FALLBACK)

    val markers = combineMarkers(
      MarkerMap(
        "origin" -> originIp,
        "referer" -> referer,
        "method" -> request.method
      ),
      elapsed
    )

    logger.info(s"""$originIp - "${request.method} ${request.uri} ${request.version}" ERROR "$referer" ${elapsed.toMillis}ms""")(markers.toLogMarker)
    logger.error(s"Error for ${request.method} ${request.uri}", throwable)
  }
}
