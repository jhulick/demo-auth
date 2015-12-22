package gov.max.auth.conf;

import java.util.HashSet;
import java.util.Set;

import javax.inject.Inject;

import gov.max.auth.security.AuthoritiesConstants;
import gov.max.auth.security.CustomUserDetailsService;
import gov.max.auth.security.jwt.TokenAuthenticationService;
import gov.max.auth.security.jwt.UserService;
import gov.max.auth.web.filter.CsrfCookieGeneratorFilter;
import gov.max.auth.web.filter.TokenGeneratorFilter;

import org.jasig.cas.client.session.SingleSignOutFilter;
import org.jasig.cas.client.validation.Cas20ServiceTicketValidator;
//import org.jasig.cas.client.validation.Saml11TicketValidator;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.env.Environment;
import org.springframework.security.cas.ServiceProperties;
import org.springframework.security.cas.authentication.CasAssertionAuthenticationToken;
import org.springframework.security.cas.authentication.CasAuthenticationProvider;
import org.springframework.security.cas.web.CasAuthenticationEntryPoint;
import org.springframework.security.cas.web.CasAuthenticationFilter;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.builders.WebSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;
import org.springframework.security.core.userdetails.AuthenticationUserDetailsService;
import org.springframework.security.web.authentication.logout.LogoutFilter;
import org.springframework.security.web.authentication.logout.SecurityContextLogoutHandler;
import org.springframework.security.web.authentication.session.SessionAuthenticationStrategy;
import org.springframework.security.web.authentication.session.SessionFixationProtectionStrategy;
import org.springframework.security.web.csrf.CsrfFilter;
import org.springframework.security.web.util.matcher.AntPathRequestMatcher;

@Configuration
@EnableWebSecurity
public class SecurityConfiguration extends WebSecurityConfigurerAdapter {

    private static final String CAS_URL_LOGIN = "cas.service.login";
    private static final String CAS_URL_LOGOUT = "cas.service.logout";
    private static final String CAS_URL_PREFIX = "cas.url.prefix";
    private static final String CAS_SERVICE_URL = "app.service.security";
    private static final String APP_SERVICE_HOME = "app.service.home";
    private static final String APP_ADMIN_USER_NAME = "app.admin.userName";

    private final TokenAuthenticationService tokenAuthenticationService;
    private final UserService userService;

    @Inject
    private Environment env;

    public SecurityConfiguration() {
        super(false);
        this.userService = new UserService();
        this.tokenAuthenticationService = new TokenAuthenticationService("tooManySecrets", userService);
    }

    @Bean
    public Set<String> adminList() {
        Set<String> admins = new HashSet<>();
        String adminUserName = env.getProperty(APP_ADMIN_USER_NAME);

        admins.add("admin");
        if (adminUserName != null && !adminUserName.isEmpty()) {
            admins.add(adminUserName);
        }
        return admins;
    }

    @Bean
    public ServiceProperties serviceProperties() {
        ServiceProperties sp = new ServiceProperties();
        sp.setService(env.getRequiredProperty(CAS_SERVICE_URL));
        sp.setSendRenew(false);
        return sp;
    }

    @Bean
    public CasAuthenticationProvider casAuthenticationProvider() {
        CasAuthenticationProvider casAuthenticationProvider = new CasAuthenticationProvider();
        casAuthenticationProvider.setAuthenticationUserDetailsService(customUserDetailsService());
        casAuthenticationProvider.setServiceProperties(serviceProperties());
        casAuthenticationProvider.setTicketValidator(cas20ServiceTicketValidator());
        casAuthenticationProvider.setKey("an_id_for_this_auth_provider_only");
        return casAuthenticationProvider;
    }

    @Bean
    public AuthenticationUserDetailsService<CasAssertionAuthenticationToken> customUserDetailsService() {
        return new CustomUserDetailsService(adminList());
    }

    @Bean
    public SessionAuthenticationStrategy sessionStrategy() {
        SessionAuthenticationStrategy sessionStrategy = new SessionFixationProtectionStrategy();
        return sessionStrategy;
    }

//    @Bean
//    public Saml11TicketValidator casSamlServiceTicketValidator() {
//        return new Saml11TicketValidator(env.getRequiredProperty(CAS_URL_PREFIX));
//    }

    @Bean
    public Cas20ServiceTicketValidator cas20ServiceTicketValidator() {
        return new Cas20ServiceTicketValidator(env.getRequiredProperty(CAS_URL_PREFIX));
    }

    @Bean
    public CasAuthenticationFilter casAuthenticationFilter() throws Exception {
        CasAuthenticationFilter casAuthenticationFilter = new CasAuthenticationFilter();
        casAuthenticationFilter.setAuthenticationManager(authenticationManager());
        casAuthenticationFilter.setSessionAuthenticationStrategy(sessionStrategy());

//        casAuthenticationFilter.setAuthenticationFailureHandler();
//        casAuthenticationFilter.setAuthenticationSuccessHandler(myAuthenticationSuccessHandler); // Do the token work here.

        return casAuthenticationFilter;
    }

    @Bean
    public CasAuthenticationEntryPoint casAuthenticationEntryPoint() {
        CasAuthenticationEntryPoint casAuthenticationEntryPoint = new CasAuthenticationEntryPoint();
        casAuthenticationEntryPoint.setLoginUrl(env.getRequiredProperty(CAS_URL_LOGIN));
        casAuthenticationEntryPoint.setServiceProperties(serviceProperties());
        return casAuthenticationEntryPoint;
    }

    @Bean
    public SingleSignOutFilter singleSignOutFilter() {
        SingleSignOutFilter singleSignOutFilter = new SingleSignOutFilter();
        singleSignOutFilter.setCasServerUrlPrefix(env.getRequiredProperty(CAS_URL_PREFIX));
        return singleSignOutFilter;
    }

    @Bean
    public LogoutFilter requestCasGlobalLogoutFilter() {
        String logoutUrl = env.getRequiredProperty(CAS_URL_LOGOUT) + "?service=" + env.getRequiredProperty(APP_SERVICE_HOME);
        LogoutFilter logoutFilter = new LogoutFilter(logoutUrl, new SecurityContextLogoutHandler());
        logoutFilter.setFilterProcessesUrl("/logout");
        logoutFilter.setFilterProcessesUrl("/j_spring_cas_security_logout");
        logoutFilter.setLogoutRequestMatcher(new AntPathRequestMatcher("/logout", "POST"));
        return logoutFilter;
    }

    @Inject
    public void configureGlobal(AuthenticationManagerBuilder auth) throws Exception {
        auth.authenticationProvider(casAuthenticationProvider());
    }

    @Override
    public void configure(WebSecurity web) throws Exception {
        web.ignoring()
                .antMatchers("/app/**")
                .antMatchers("/bower_components/**")
                .antMatchers("/content/**")
                .antMatchers("/fonts/**")
                .antMatchers("/images/**")
                .antMatchers("/scripts/**")
                .antMatchers("/styles/**")
                .antMatchers("/views/**")
                .antMatchers("/i18n/**");
    }

    @Override
    protected void configure(HttpSecurity http) throws Exception {
        http
                .addFilterAfter(new CsrfCookieGeneratorFilter(), CsrfFilter.class)
                .addFilterAfter(new TokenGeneratorFilter(tokenAuthenticationService, userService), LogoutFilter.class)
                .exceptionHandling()
                .authenticationEntryPoint(casAuthenticationEntryPoint()).and()
                .addFilter(casAuthenticationFilter())
                .addFilterBefore(singleSignOutFilter(), CasAuthenticationFilter.class)
                .addFilterBefore(requestCasGlobalLogoutFilter(), LogoutFilter.class);

        http
                .headers().frameOptions().disable()
                .authorizeRequests()
                .antMatchers("/", "/login", "/logout", "/api/secure", "/api/admin").authenticated()
                .antMatchers("/api/admin").hasAuthority(AuthoritiesConstants.ADMIN)
                .anyRequest().authenticated();

        /**
         * <logout invalidate-session="true" delete-cookies="JSESSIONID" />
         */
        http
                .logout()
                .logoutUrl("/logout")
                .logoutSuccessUrl("/")
                .invalidateHttpSession(true)
                .deleteCookies("JSESSIONID");

        // http.csrf();
    }
}
