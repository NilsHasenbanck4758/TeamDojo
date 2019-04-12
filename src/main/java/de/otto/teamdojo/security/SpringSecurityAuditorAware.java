package de.otto.teamdojo.security;

import de.otto.teamdojo.config.Constants;
import org.springframework.data.domain.AuditorAware;
import org.springframework.stereotype.Component;

import java.util.Optional;

/**
 * Implementation of AuditorAware based on Spring Security.
 */
@Component
public class SpringSecurityAuditorAware implements AuditorAware<String> {

    @Override
    public Optional<String> getCurrentAuditor() {
        // There is currently no reactive AuditorAware implementation so we can't
        // extract the currently logged-in user from the Reactor Context.
        // Therefore createdBy and lastModifiedBy will have to be set explicitly.
        // See https://jira.spring.io/browse/DATACMNS-1231
        return Optional.of(Constants.SYSTEM_ACCOUNT);
    }
}
