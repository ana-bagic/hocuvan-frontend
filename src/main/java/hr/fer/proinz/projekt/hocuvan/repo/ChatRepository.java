package hr.fer.proinz.projekt.hocuvan.repo;

import hr.fer.proinz.projekt.hocuvan.domain.Chat;
import hr.fer.proinz.projekt.hocuvan.domain.Message;
import hr.fer.proinz.projekt.hocuvan.domain.Organizer;
import hr.fer.proinz.projekt.hocuvan.domain.Visitor;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ChatRepository extends JpaRepository<Chat, Long> {
    //Chat getByVisitorIdAndOrAndOrganizerId(Visitor visitor, Organizer organizer);

    List<Chat> getAllByOrganizerId(Organizer organizer);

    List<Chat> getAllByVisitorId(Visitor visitor);

    boolean existsByVisitorId(Visitor visitor);

    boolean existsByOrganizerId(Organizer organizer);
}
