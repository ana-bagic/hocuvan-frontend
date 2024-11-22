package hr.fer.proinz.projekt.hocuvan.service.impl;

import hr.fer.proinz.projekt.hocuvan.domain.Chat;
import hr.fer.proinz.projekt.hocuvan.domain.Organizer;
import hr.fer.proinz.projekt.hocuvan.domain.Visitor;
import hr.fer.proinz.projekt.hocuvan.repo.ChatRepository;
import hr.fer.proinz.projekt.hocuvan.repo.OrganizerRepo;
import hr.fer.proinz.projekt.hocuvan.repo.VisitorRepo;
import hr.fer.proinz.projekt.hocuvan.service.ChatService;
import hr.fer.proinz.projekt.hocuvan.service.EntityMissingException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import javax.swing.text.html.parser.Entity;
import java.util.List;
import java.util.Optional;

@Service
public class ChatServiceJpa implements ChatService {
    @Autowired
    ChatRepository chatRepository;

    @Autowired
    VisitorRepo visitorRepo;

    @Autowired
    OrganizerRepo organizerRepo;

    /*@Override
    public Chat getByVisitorAndOrganizer(Visitor visitor, Organizer organizer) {
        if(visitor!=null && organizer!=null && organizerRepo.existsById(organizer.getId()) && visitorRepo.existsById(visitor.getId())){
            Chat chat = chatRepository.getByVisitorIdAndOrAndOrganizerId(visitor,organizer);
            return chat;
        }else {
            return null;
        }
    }*/

    @Override
    public Chat save(Chat chat) {
        return chatRepository.save(chat);
    }

    @Override
    public Optional<Chat> findById(long id) {
        return chatRepository.findById(id);
    }

    @Override
    public Chat fetch(long id) {
        return findById(id).orElseThrow(
                () -> new EntityMissingException(Chat.class)
        );
    }

    @Override
    public List<Chat> getAllByVisitor(Visitor visitor) {
        if(visitor!=null && chatRepository.existsByVisitorId(visitor)){
            List<Chat> chats =chatRepository.getAllByVisitorId(visitor);
            return chats;
        }
        return null;
    }

    @Override
    public List<Chat> getAllByOrganizer(Organizer organizer) {
        if(organizer!=null && chatRepository.existsByOrganizerId(organizer)){
            List<Chat> chats =chatRepository.getAllByOrganizerId(organizer);
            return chats;
        }
        return null;
    }
}
