package com.ecommerce.resolver;

import com.ecommerce.annotation.CurrentUser;
import com.ecommerce.exception.TokenExpiredException;
import com.ecommerce.exception.UnauthenticatedException;
import com.ecommerce.exception.UnauthorizedException;
import com.ecommerce.exception.UserException;
import com.ecommerce.model.User;
import com.ecommerce.service.UserService;
import io.jsonwebtoken.MalformedJwtException;
import io.jsonwebtoken.SignatureException;
import lombok.RequiredArgsConstructor;
import org.springframework.core.MethodParameter;
import org.springframework.stereotype.Component;
import org.springframework.web.bind.support.WebDataBinderFactory;
import org.springframework.web.context.request.NativeWebRequest;
import org.springframework.web.method.support.HandlerMethodArgumentResolver;
import org.springframework.web.method.support.ModelAndViewContainer;

@Component
@RequiredArgsConstructor
public class CurrentUserArgumentResolver implements HandlerMethodArgumentResolver {

    private final UserService userService;

    @Override
    public boolean supportsParameter(MethodParameter parameter) {
        return parameter.getParameterAnnotation(CurrentUser.class) != null &&
                parameter.getParameterType().equals(User.class);
    }

    @Override
    public Object resolveArgument(MethodParameter parameter,
                                  ModelAndViewContainer mavContainer,
                                  NativeWebRequest webRequest,
                                  WebDataBinderFactory binderFactory) throws Exception {

        String authHeader = webRequest.getHeader("Authorization");

        // Validate Authorization header
        if (authHeader == null || authHeader.isBlank() || !authHeader.startsWith("Bearer ")) {
            throw new UnauthenticatedException("Invalid or missing Authorization header");
        }

//        String jwt = authHeader.substring(7); // Remove "Bearer "

        try {
            // Delegate to your service (should verify and parse JWT)
            return userService.findUserProfileByJwt(authHeader);
        } catch (TokenExpiredException e) {
            throw new UnauthenticatedException("JWT token has expired");
        } catch (MalformedJwtException | SignatureException e) {
            throw new UnauthenticatedException("Invalid JWT token");
        } catch (UserException e) {
            throw new UnauthorizedException("User could not be authenticated");
        } catch (Exception e) {
            throw new UnauthenticatedException("Could not authenticate user " + e.getMessage());
        }
    }

}
