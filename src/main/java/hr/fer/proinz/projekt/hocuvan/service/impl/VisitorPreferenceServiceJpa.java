package hr.fer.proinz.projekt.hocuvan.service.impl;

import hr.fer.proinz.projekt.hocuvan.domain.*;
import hr.fer.proinz.projekt.hocuvan.repo.EventCategoryRepository;
import hr.fer.proinz.projekt.hocuvan.repo.EventRepository;
import hr.fer.proinz.projekt.hocuvan.repo.VisitorPreferenceRepository;
import hr.fer.proinz.projekt.hocuvan.repo.VisitorRepo;
import hr.fer.proinz.projekt.hocuvan.service.VisitorPreferenceService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class VisitorPreferenceServiceJpa implements VisitorPreferenceService {

    @Autowired
    private VisitorPreferenceRepository visitorPreferenceRepository;

    @Autowired
    private EventRepository eventRepository;

    @Autowired
    private VisitorRepo visitorRepo;

    @Override
    public List<Event> getEventsOfFavouriteCategories(Visitor visitor) {
        List<VisitorPreference> preferences=visitorPreferenceRepository.getAllByVisitorId(visitor);
        List<Event> events=new ArrayList<>();
        for(int i=0;i<preferences.size();i++){
            events.addAll(eventRepository.findAllByCategoryId(preferences.get(0).getCategoryId()));
        }
        return  events;
    }

    @Override
    public void save(EventCategory category, Visitor visitor) {
        VisitorPreference visitorPreference=new VisitorPreference(visitor,category);
        visitorPreferenceRepository.save(visitorPreference);
    }

    @Override
    public List<VisitorPreference> deleteAllByVisitor(Visitor visitor) {
        List<VisitorPreference> visitorPreferences=new ArrayList<>();
        if(visitorRepo.existsById(visitor.getId())) {
            visitorPreferences = visitorPreferenceRepository.deleteAllByVisitorId(visitor);
        }
        return visitorPreferences;
    }

    @Override
    public List<VisitorPreference> findAllByVisitor(Visitor visitor) {
        List<VisitorPreference> visitorPreferences = new ArrayList<>();
        if(visitor != null && visitor.getId()!=null && visitorRepo.existsById(visitor.getId())){
            visitorPreferences = visitorPreferenceRepository.findAllByVisitorId(visitor);
         }
        return visitorPreferences;
    }
}
