package gov.max.auth.web.rest;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.fasterxml.jackson.annotation.JsonRawValue;
import com.fasterxml.jackson.annotation.JsonValue;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import org.springframework.http.MediaType;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.logout.SecurityContextLogoutHandler;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

/**
 * REST controller for managing a secure resource.
 */
@RestController
@RequestMapping("/api")
public class RestrictedResource {

    private final Logger log = LoggerFactory.getLogger(RestrictedResource.class);

    /**
     * GET /api/authenticate -> check if the user is authenticated, and return its login.
     */
    @RequestMapping(value = "authenticate", method = RequestMethod.GET, produces = MediaType.APPLICATION_JSON_VALUE)
    public String isAuthenticated(HttpServletRequest request) {
        log.debug("REST request to check if the current user is authenticated");
        return request.getRemoteUser();
    }

    /**
     * GET /api/secure -> check if the user is authenticated, and return its login.
     */
    @RequestMapping(value = "secure", method = RequestMethod.GET, produces = MediaType.APPLICATION_JSON_VALUE)
    public @ResponseBody Json restricted(HttpServletRequest request) {
        log.debug("REST request to check if the current user is authenticated");
        return new Json("{ \"name\" : \"ping secure api\" }");
    }

    /**
     * GET /api/admin -> check if the user is authenticated, and return its login.
     */
    @RequestMapping(value = "admin", method = RequestMethod.GET, produces = MediaType.APPLICATION_JSON_VALUE)
    public @ResponseBody Json admin(HttpServletRequest request) {
        log.debug("REST request to check if the current user has ADMIN role");
        return new Json("{ \"name\" : \"ping admin api\" }");
    }

    @RequestMapping(value="/logout", method = RequestMethod.GET)
    public String logoutPage (HttpServletRequest request, HttpServletResponse response) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth != null) {
            log.debug("REST request to logout " + auth.getName());
            new SecurityContextLogoutHandler().logout(request, response, auth);
        }
        return "redirect:/"; //You can redirect wherever you want, but generally it's a good practice to show login screen again.
    }

    class Json {
        private final String value;

        public Json(String value) {
            this.value = value;
        }

        @JsonValue
        @JsonRawValue
        public String value() {
            return value;
        }
    }
}
