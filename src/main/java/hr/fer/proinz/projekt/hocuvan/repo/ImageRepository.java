package hr.fer.proinz.projekt.hocuvan.repo;

import hr.fer.proinz.projekt.hocuvan.domain.Event;
import hr.fer.proinz.projekt.hocuvan.domain.Image;
import hr.fer.proinz.projekt.hocuvan.domain.Organizer;
import hr.fer.proinz.projekt.hocuvan.domain.Visitor;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ImageRepository extends JpaRepository<Image, Long> {

    Image findByEvent(Event event);
    Image findByVisitor(Visitor visitor);
    Image findByOrganizer(Organizer organizer);


}
