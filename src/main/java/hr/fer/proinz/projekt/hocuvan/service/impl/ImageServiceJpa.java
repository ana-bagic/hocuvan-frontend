package hr.fer.proinz.projekt.hocuvan.service.impl;

import hr.fer.proinz.projekt.hocuvan.domain.Event;
import hr.fer.proinz.projekt.hocuvan.domain.Image;
import hr.fer.proinz.projekt.hocuvan.domain.Organizer;
import hr.fer.proinz.projekt.hocuvan.domain.Visitor;
import hr.fer.proinz.projekt.hocuvan.repo.ImageRepository;
import hr.fer.proinz.projekt.hocuvan.service.ImageService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.util.Assert;

@Service
public class ImageServiceJpa  implements ImageService {

    @Autowired
    private ImageRepository imageRepository;

    @Override
    public Image createImage(Image image) {

        return imageRepository.save(image);
    }


    @Override
    public Image findByVisitor(Visitor visitor) {
        //Assert.notNull(username, "Korisničko ime je prazno");
        return imageRepository.findByVisitor(visitor);
    }

    @Override
    public Image findByOrganizer(Organizer organizer) {
        return imageRepository.findByOrganizer(organizer);
    }

    @Override
    public Image findByEvent(Event event) {
        return imageRepository.findByEvent(event);
    }
}
