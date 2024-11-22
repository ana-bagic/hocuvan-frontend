package hr.fer.proinz.projekt.hocuvan.service;

import hr.fer.proinz.projekt.hocuvan.domain.Event;
import hr.fer.proinz.projekt.hocuvan.domain.Image;
import hr.fer.proinz.projekt.hocuvan.domain.Organizer;
import hr.fer.proinz.projekt.hocuvan.domain.Visitor;

public interface ImageService {

    Image createImage(Image image);

    Image findByVisitor(Visitor visitor);

    Image findByOrganizer(Organizer organizer);

    Image findByEvent(Event event);

}
