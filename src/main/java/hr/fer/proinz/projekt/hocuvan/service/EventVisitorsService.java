package hr.fer.proinz.projekt.hocuvan.service;

import hr.fer.proinz.projekt.hocuvan.domain.Event;
import hr.fer.proinz.projekt.hocuvan.domain.EventVisitors;
import hr.fer.proinz.projekt.hocuvan.domain.Visitor;
import hr.fer.proinz.projekt.hocuvan.helpers.EventDTO;
import hr.fer.proinz.projekt.hocuvan.helpers.VisitorDTO;

import java.util.List;

public interface EventVisitorsService {

    void save(Event event, Visitor visitor);

    void remove(Event event, Visitor visitor);

    List<EventDTO> getEventsOfVisitor(Visitor visitor);

    List<VisitorDTO> getVisitorsOfEvent(Event event);

    List<EventDTO> getMostPopularEvents();
}
