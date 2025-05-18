package com.zos.services;

import java.util.List;
import com.zos.exception.ReeelException;
import com.zos.exception.UserException;
import com.zos.model.Reels;

public interface ReelService {
	Reels createReel(Reels reel) throws ReeelException;
	List<Reels> findAllReels();
	List<Reels> findReelsByUserId(Integer userId);
	Reels findReelById(Integer reelId) throws ReeelException;
	Reels updateReel(Integer reelId, Reels reel) throws ReeelException;
	String deleteReel(Integer reelId, Integer userId) throws ReeelException, UserException;
}