package hr.fer.proinz.projekt.hocuvan.service;

import hr.fer.proinz.projekt.hocuvan.domain.Chat;
import hr.fer.proinz.projekt.hocuvan.domain.Organizer;
import hr.fer.proinz.projekt.hocuvan.domain.Visitor;

import java.util.List;
import java.util.Optional;

public interface ChatService {
    //Chat getByVisitorAndOrganizer(Visitor visitor, Organizer organizer);

    Chat save(Chat chat);

    Optional<Chat> findById(long id);

    Chat fetch(long id);

    List<Chat> getAllByVisitor(Visitor visitor);

    List<Chat> getAllByOrganizer(Organizer organizer);
}
