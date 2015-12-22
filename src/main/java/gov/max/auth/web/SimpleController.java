package gov.max.auth.web;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;

@Controller
public class SimpleController {

    private final Logger log = LoggerFactory.getLogger(this.getClass());

    @RequestMapping("/login")
    public String login() {
        return "redirect:/";
    }

    // @RequestMapping("/j_spring_cas_security_logout")
    // public String spring_logout() {
    // return "redirect:/logout";
    // }

    // @RequestMapping("/logout")
    // public String logout() {
    // return "redirect:/";
    // }

//    @RequestMapping(value = {"/", ""}, method = RequestMethod.GET)
//    public String index(Model model) {
//        String user = getUser();
//        log.info("passing in /");
//        model.addAttribute("user", user);
//
//        // renders /WEB-INF/jsp/index.jsp
////        return "index";
//        return "Hello World! (user: " + user + ")";
//    }



    @RequestMapping(value = "/secure", method = RequestMethod.GET)
    public String secure(Model model) {
        String user = getUser();
        log.info("passing in /");
        model.addAttribute("user", user);

        // renders /WEB-INF/jsp/index.jsp
        return "secure/index";
        // return "Hello World! (user: " + user + ")";
    }

    @RequestMapping(value = "/filtered", method = RequestMethod.GET)
    public String filtered(Model model) {
        String user = getUser();
        log.info("passing in /");
        model.addAttribute("user", user);

        // renders /WEB-INF/jsp/index.jsp
        return "secure/admin/index";
        // return "Hello World! (user: " + user + ")";
    }

    private String getUser() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        return auth.getName();
    }
}