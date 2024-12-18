package hr.fer.proinz.projekt.hocuvan.rest;

import java.util.HashMap;
import java.util.Map;

import org.springframework.core.Ordered;
import org.springframework.core.annotation.Order;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.context.request.WebRequest;

@Order(Ordered.HIGHEST_PRECEDENCE)
@ControllerAdvice
public class RestExceptionHandler {

	@ExceptionHandler(IllegalArgumentException.class)
	protected ResponseEntity<?> handleIllegalArgument(Exception e, WebRequest req) {
		Map<String, String> props = new HashMap<>();
		props.put("message", e.getMessage());
		props.put("status", "400");
		props.put("error", "Bad Request");
		
		return new ResponseEntity<>(props, HttpStatus.BAD_REQUEST);
	}
}
