package com.ecommerce.utility;

import jakarta.servlet.http.HttpServletRequest;

public class RequestDetailsUtil {

    public static String buildDetailedRequestInfo(HttpServletRequest request) {
        return String.format(
                "Method=%s, URI=%s, IP=%s, User-Agent=%s",
                request.getMethod(),
                request.getRequestURI(),
                request.getRemoteAddr(),
                request.getHeader("User-Agent")
        );
    }

}
