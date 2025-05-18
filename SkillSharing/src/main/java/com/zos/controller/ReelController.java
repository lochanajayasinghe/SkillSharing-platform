package com.zos.controller;

import java.util.List;

import com.zos.model.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.zos.dto.UserDto;
import com.zos.exception.ReeelException;
import com.zos.exception.UserException;
import com.zos.model.Reels;
import com.zos.response.MessageResponse;
import com.zos.services.ReelService;
import com.zos.services.UserService;

@RestController
@RequestMapping("/api/reels")
public class ReelController {

    @Autowired
    private ReelService reelService;

    @Autowired
    private UserService userService;

    @PostMapping
    public ResponseEntity<Reels> createReelHandler(
            @RequestBody Reels reel,
            @RequestHeader("Authorization") String token) throws UserException, ReeelException {

        // Changed from findUserProfileByJwt to findUserProfile
        User user = userService.findUserProfile(token);

        // Convert User to UserDto
        UserDto userDto = new UserDto();
        userDto.setEmail(user.getEmail());
        userDto.setUsername(user.getUsername());
        userDto.setId(user.getId());
        userDto.setName(user.getName());
        userDto.setUserImage(user.getImage());

        reel.setUser(userDto);

        Reels createdReel = reelService.createReel(reel);
        return new ResponseEntity<>(createdReel, HttpStatus.CREATED);
    }

    @GetMapping
    public ResponseEntity<List<Reels>> findAllReelsHandler() {
        List<Reels> reels = reelService.findAllReels();
        return new ResponseEntity<>(reels, HttpStatus.OK);
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<Reels>> findUserReelsHandler(@PathVariable Integer userId) {
        List<Reels> reels = reelService.findReelsByUserId(userId);
        return new ResponseEntity<>(reels, HttpStatus.OK);
    }

    @DeleteMapping("/{reelId}")
    public ResponseEntity<MessageResponse> deleteReelHandler(
            @PathVariable Integer reelId,
            @RequestHeader("Authorization") String token) throws ReeelException, UserException {

        // Changed from findUserProfileByJwt to findUserProfile
        User user = userService.findUserProfile(token);

        reelService.deleteReel(reelId, user.getId());

        MessageResponse res = new MessageResponse("Reel deleted successfully");
        return new ResponseEntity<>(res, HttpStatus.OK);
    }
}