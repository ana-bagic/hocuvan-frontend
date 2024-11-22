package hr.fer.proinz.projekt.hocuvan.repo;

import hr.fer.proinz.projekt.hocuvan.domain.Event;
import hr.fer.proinz.projekt.hocuvan.domain.EventVisitors;
import hr.fer.proinz.projekt.hocuvan.domain.Message;
import hr.fer.proinz.projekt.hocuvan.domain.Visitor;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface EventVisitorsRepository extends JpaRepository<EventVisitors, Long> {
    List<EventVisitors> getAllByEventId(Event event);
    List<EventVisitors> getAllByVisitorId(Visitor visitor);

    int countByEventId(Event event);
}
