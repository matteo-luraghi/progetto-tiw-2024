package dao;

import java.sql.Connection;    
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;

import beans.User;

import java.util.ArrayList;

public class UserDAO {
	private Connection connection;
	
	public UserDAO(Connection connection) {
		this.connection = connection;
	}
	
	public User checkCredentials(String username, String password) throws SQLException {
		String query = "SELECT * FROM `user` WHERE username = ? AND password = ?";
		
		try (PreparedStatement pstatement = connection.prepareStatement(query)) {
			pstatement.setString(1, username);
			pstatement.setString(2, password);
			
			try (ResultSet result = pstatement.executeQuery()) {
				if (!result.isBeforeFirst()) return null;
				else {
					result.next();
					return getUserFromResult(result);
				}
			}
		}
	}
	
	public User getUser(int userId) throws SQLException {
		String query = "SELECT * FROM `user` WHERE id = ?";
		
		try (PreparedStatement pstatement = connection.prepareStatement(query)) {
			pstatement.setString(1, Integer.toString(userId));
			
			try (ResultSet result = pstatement.executeQuery()) {
				if (!result.isBeforeFirst()) return null;
				else {
					result.next();
					return getUserFromResult(result);
				}
			}
		}
	}
	
	public int createUser(String username, String email, String password, String name, String surname) throws SQLException {
		String query = "INSERT INTO `user` (username, email, password, name, surname) VALUES (?, ?, ?, ?, ?)";
		
		try (PreparedStatement pstatement = connection.prepareStatement(query, Statement.RETURN_GENERATED_KEYS)) {
			pstatement.setString(1, username);
			pstatement.setString(2, email);
			pstatement.setString(3, password);
			pstatement.setString(4, name);
			pstatement.setString(5, surname);
			
			pstatement.executeUpdate();
			ResultSet generatedKeys = pstatement.getGeneratedKeys();
			if (generatedKeys.next()) {
				int userId = generatedKeys.getInt(1);
				return userId;
			}
		}
		return -1;
	}
	
	public User getCreator(int groupId) throws SQLException {
		String query = "SELECT * FROM `user` u JOIN `created` c ON (u.id = c.user_id) WHERE c.group_id = ?";
		
		try (PreparedStatement pstatement = connection.prepareStatement(query)) {
			pstatement.setString(1, Integer.toString(groupId));
			
			try (ResultSet result = pstatement.executeQuery()) {
				if (!result.isBeforeFirst()) return null;
				else {
					result.next();
					return getUserFromResult(result);
				}
			}
		}
	}
	
	public boolean checkNewUsername(String username) throws SQLException {
		String query = "SELECT email FROM `user` where username = ?";
		
		try (PreparedStatement pstatement = connection.prepareStatement(query)) {
			pstatement.setString(1, username);
			try (ResultSet result = pstatement.executeQuery()) {
				if (!result.isBeforeFirst()) return true; // no user with the same username in the db
				return false;
			}
		}
	}
	
	public ArrayList<User> getGroupParticipants(int group_id) throws SQLException {
		// get all users in the group referenced by group_id
		String query = "SELECT * FROM `contains` c RIGHT JOIN user u ON (c.user_id = u.id) WHERE group_id = ?";
		ArrayList<User> users = new ArrayList<>();
		
		try (PreparedStatement pstatement = connection.prepareStatement(query)) {
			pstatement.setString(1, Integer.toString(group_id));
			
			try (ResultSet result = pstatement.executeQuery()) {
				if (!result.isBeforeFirst()) return null;
				else {
					while (result.next()) {
						User user = getUserFromResult(result);
						users.add(user);
					}
					return users;
				}
			}
		}
	}
	
	public ArrayList<User> getRegisteredUsers() throws SQLException {
		String query = "SELECT * FROM `user` ORDER BY surname ASC, name ASC";
		ArrayList<User> users = new ArrayList<>();
		
		try (PreparedStatement pstatement = connection.prepareStatement(query)) {
			try (ResultSet result = pstatement.executeQuery()) {
				if (!result.isBeforeFirst()) return null;
				else {
					while (result.next()) {
						User user = getUserFromResult(result);
						users.add(user);
					}
					return users;
				}
			}
		}
	}
	
	// create User object from DB response
	private User getUserFromResult(ResultSet result) throws SQLException {
		int user_id = Integer.parseInt(result.getString("id"));
		String user_username = result.getString("username");
		String user_email = result.getString("email");
		String user_name = result.getString("name");
		String user_surname = result.getString("surname");
		return new User(user_id, user_username, user_email, user_name, user_surname);
	}
	
}