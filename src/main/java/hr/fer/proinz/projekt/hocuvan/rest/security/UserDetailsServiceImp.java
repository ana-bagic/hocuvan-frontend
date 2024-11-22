package hr.fer.proinz.projekt.hocuvan.rest.security;

import hr.fer.proinz.projekt.hocuvan.domain.Organizer;
import hr.fer.proinz.projekt.hocuvan.domain.Visitor;
import hr.fer.proinz.projekt.hocuvan.service.EntityMissingException;
import hr.fer.proinz.projekt.hocuvan.service.OrganizerService;
import hr.fer.proinz.projekt.hocuvan.service.VisitorService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

import static org.springframework.security.core.authority.AuthorityUtils.commaSeparatedStringToAuthorityList;

@Service
public class UserDetailsServiceImp implements UserDetailsService {
    @Value("${admin.password}")
    private String adminPasswordHash;

    @Autowired
    private VisitorService visitorService;

    @Autowired
    private OrganizerService organizerService;


    @Override
    @Transactional
    public User loadUserByUsername(String username) throws UsernameNotFoundException {
        List<GrantedAuthority> authorities;
        User user;
        if ("admin".equals(username)) {
            authorities = commaSeparatedStringToAuthorityList("ROLE_ADMIN");
            user=new User(username,adminPasswordHash,authorities);
        }else {
            Visitor visitor = visitorService.findByUsername(username);
            Organizer organizer = organizerService.findByUsername(username);
            if (visitor != null) {
                authorities = commaSeparatedStringToAuthorityList("ROLE_VISITOR");
                user=new User(username,visitor.getPassword(),authorities);
            } else if (organizer != null) {
                authorities = commaSeparatedStringToAuthorityList("ROLE_ORGANIZER");
                user=new User(username,organizer.getPassword(),authorities);
            } else {
                throw new EntityMissingException(User.class);
            }
        }

        return user;
    }


}
