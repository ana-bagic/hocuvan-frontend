package hr.fer.proinz.projekt.hocuvan.repo;

import hr.fer.proinz.projekt.hocuvan.domain.EventVisitors;
import hr.fer.proinz.projekt.hocuvan.domain.Visitor;
import hr.fer.proinz.projekt.hocuvan.domain.VisitorPreference;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface VisitorPreferenceRepository extends JpaRepository<VisitorPreference, Long> {
    List<VisitorPreference> getAllByVisitorId(Visitor visitor);

    List<VisitorPreference> deleteAllByVisitorId(Visitor visitor);

    List<VisitorPreference> findAllByVisitorId(Visitor visitor);
}
