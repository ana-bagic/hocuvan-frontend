package hr.fer.proinz.projekt.hocuvan.rest;

import hr.fer.proinz.projekt.hocuvan.helpers.StatisticsDTO;
import hr.fer.proinz.projekt.hocuvan.service.EventService;
import hr.fer.proinz.projekt.hocuvan.service.OrganizerService;
import hr.fer.proinz.projekt.hocuvan.service.RequestDeniedException;
import hr.fer.proinz.projekt.hocuvan.service.VisitorService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/stats")
public class StatisticsController {

    @Autowired
    EventService eventService;
    @Autowired
    OrganizerService organizerService;
    @Autowired
    VisitorService visitorService;

    @GetMapping("")
    @CrossOrigin(origins = {"https://hocuvan-deployment.herokuapp.com","http://localhost:4200"})
    @Transactional
    public ResponseEntity<Object> getStat() {
        try {
            long numberOfEvents=eventService.countAll();
            long numberOfOrganizers=organizerService.countAll();
            long numberOfVisitors=visitorService.countAll();
                return ResponseEntity.status(HttpStatus.OK).body(new StatisticsDTO(numberOfEvents,numberOfOrganizers,numberOfVisitors));
        } catch (RequestDeniedException ex) {
            return ResponseEntity.badRequest().body(ex);
        }
    }


}
