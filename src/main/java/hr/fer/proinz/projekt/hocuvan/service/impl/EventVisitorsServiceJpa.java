package hr.fer.proinz.projekt.hocuvan.service.impl;

import hr.fer.proinz.projekt.hocuvan.domain.Event;
import hr.fer.proinz.projekt.hocuvan.domain.EventVisitors;
import hr.fer.proinz.projekt.hocuvan.domain.Visitor;
import hr.fer.proinz.projekt.hocuvan.helpers.EventDTO;
import hr.fer.proinz.projekt.hocuvan.helpers.VisitorDTO;
import hr.fer.proinz.projekt.hocuvan.repo.EventRepository;
import hr.fer.proinz.projekt.hocuvan.repo.EventVisitorsRepository;
import hr.fer.proinz.projekt.hocuvan.service.EventService;
import hr.fer.proinz.projekt.hocuvan.service.EventVisitorsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import javax.swing.text.html.parser.Entity;
import java.util.*;

@Service
public class EventVisitorsServiceJpa implements EventVisitorsService {

    @Autowired
    EventVisitorsRepository eventVisitorsRepository;

    @Autowired
    EventRepository eventRepository;

    @Override
    public void save(Event event, Visitor visitor) {
        EventVisitors eventVisitors=new EventVisitors(event,visitor);
        eventVisitorsRepository.save(eventVisitors);
    }

    @Override
    public void remove(Event event, Visitor visitor) {
        EventVisitors eventVisitors=new EventVisitors(event,visitor);
        eventVisitorsRepository.delete(eventVisitors);

    }

    @Override
    public List<EventDTO> getEventsOfVisitor(Visitor visitor) {
        List<EventDTO> events=new ArrayList<>();
        List<EventVisitors> eventVisitors=eventVisitorsRepository.getAllByVisitorId(visitor);
        for(EventVisitors ev : eventVisitors){
            events.add(EventDTO.fromEventToEventDTO(ev.getEventId()));
        }
        return events;
    }

    @Override
    public List<VisitorDTO> getVisitorsOfEvent(Event event) {
        List<VisitorDTO> visitors=new ArrayList<>();
        List<EventVisitors> eventVisitors=eventVisitorsRepository.getAllByEventId(event);
        for(EventVisitors ev : eventVisitors){
            visitors.add(VisitorDTO.fromVisitorToVisitorDTO(ev.getVisitorId()));
        }
        return visitors;
    }

    @Override
    public List<EventDTO> getMostPopularEvents() {
        Map<Long,Integer> idNumVisitorsMap=new HashMap<>();
        List<EventVisitors> eventVisitors =eventVisitorsRepository.findAll();
        for(EventVisitors ev : eventVisitors){
            if(idNumVisitorsMap.containsKey(ev.getEventId().getEventId())){
            }else{
                idNumVisitorsMap.put(ev.getEventId().getEventId(), eventVisitorsRepository.countByEventId(ev.getEventId()));
            }
        }

        LinkedHashMap<Long, Integer> reverseSortedMap = new LinkedHashMap<>();

        idNumVisitorsMap.entrySet()
                .stream()
                .sorted(Map.Entry.comparingByValue(Comparator.reverseOrder()))
                .forEachOrdered(x -> reverseSortedMap.put(x.getKey(), x.getValue()));

        List<EventDTO> mostPopularEvents=new ArrayList<>();
        int cnt=0;
        for(Long key : reverseSortedMap.keySet()){
            if(cnt<6){
                mostPopularEvents.add(EventDTO.fromEventToEventDTO(eventRepository.findByEventId(key)));
            }
            else {
                break;
            }
            cnt++;
        }
        
        return mostPopularEvents;

    }


}
