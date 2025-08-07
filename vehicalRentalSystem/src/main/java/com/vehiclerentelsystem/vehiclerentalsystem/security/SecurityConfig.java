package com.vehicalrentelsystem.vehicalrentalsystem.security;

import com.vehicalrentelsystem.vehicalrentalsystem.service.AuthService;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Lazy;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.List;

@Configuration
public class SecurityConfig {

    private final AuthService authService;
    private final JwtFilter jwtFilter;

    // Use @Lazy on the AuthService injection to break the circular dependency
    public SecurityConfig(@Lazy AuthService authService, JwtFilter jwtFilter) {
        this.authService = authService;
        this.jwtFilter = jwtFilter;
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public AuthenticationProvider authenticationProvider() {
        DaoAuthenticationProvider provider = new DaoAuthenticationProvider();
        provider.setUserDetailsService(authService);
        provider.setPasswordEncoder(passwordEncoder());
        return provider;
    }

    @Bean
    public AuthenticationManager authManager(HttpSecurity http) throws Exception {
        AuthenticationManagerBuilder builder = http.getSharedObject(AuthenticationManagerBuilder.class);
        builder.authenticationProvider(authenticationProvider());
        return builder.build();
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http.csrf(csrf -> csrf.disable())
                .cors(cors -> cors.configurationSource(corsConfigurationSource()))
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers("/auth/**").permitAll()
                        .requestMatchers("/uploads/**").permitAll()
                        .requestMatchers("/vehicle/details/**").permitAll()
                        .requestMatchers("/payment/**").permitAll()
                        .requestMatchers("/booking/check-availability").permitAll()

                        .requestMatchers("/vehicle/my-vehicles").hasAuthority("ROLE_OWNER")
                        .requestMatchers("/vehicle/update-status/**").hasAuthority("ROLE_OWNER")
                        .requestMatchers("/vehicle/add").hasAnyAuthority("ROLE_ADMIN", "ROLE_USER", "ROLE_OWNER")
                        .requestMatchers("/vehicle/owner/**").hasAuthority("ROLE_OWNER")
                        .requestMatchers("/vehicle/admin/**").hasAuthority("ROLE_ADMIN")
                        .requestMatchers("/booking/**").hasAnyAuthority("ROLE_USER", "ROLE_ADMIN", "ROLE_OWNER")
                        .requestMatchers(HttpMethod.DELETE, "/vehicle/delete/**").hasAnyAuthority("ROLE_USER", "ROLE_ADMIN", "ROLE_OWNER")
                        .requestMatchers("/api/vehicles").hasAnyAuthority("ROLE_USER", "ROLE_ADMIN", "ROLE_OWNER")

                        .anyRequest().authenticated()
                )
                .authenticationProvider(authenticationProvider())
                .addFilterBefore(jwtFilter, UsernamePasswordAuthenticationFilter.class);




        return http.build();
    }



    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowedOrigins(List.of("http://localhost:3000")); // Frontend URL
        configuration.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        configuration.setAllowedHeaders(List.of("Authorization", "Content-Type"));
        configuration.setAllowCredentials(true);


        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }
}
