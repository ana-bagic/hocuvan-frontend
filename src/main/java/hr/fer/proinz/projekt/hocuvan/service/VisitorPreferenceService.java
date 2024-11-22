package hr.fer.proinz.projekt.hocuvan.service;

import hr.fer.proinz.projekt.hocuvan.domain.Event;
import hr.fer.proinz.projekt.hocuvan.domain.EventCategory;
import hr.fer.proinz.projekt.hocuvan.domain.Visitor;
import hr.fer.proinz.projekt.hocuvan.domain.VisitorPreference;

import java.util.List;

public interface VisitorPreferenceService {
    List<Event> getEventsOfFavouriteCategories(Visitor visitor);

    void save(EventCategory category, Visitor visitor);

    List<VisitorPreference> deleteAllByVisitor(Visitor visitor);

    List<VisitorPreference> findAllByVisitor(Visitor visitor);
}
