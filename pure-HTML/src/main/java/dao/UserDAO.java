package dao;

import java.sql.Connection;    
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;

import beans.User;

public class UserDAO {
	private Connection connection;
	
	public UserDAO(Connection connection) {
		this.connection = connection;
	}
	
	public User checkCredentials(String email, String password) throws SQLException {
		String query = "SELECT * FROM user WHERE email = ? AND password = ?";
		
		try (PreparedStatement pstatement = connection.prepareStatement(query)) {
			pstatement.setString(1, email);
			pstatement.setString(2, password);
			try (ResultSet result = pstatement.executeQuery()) {
				if (!result.isBeforeFirst()) return null;
				else {
					result.next();
					String user_name = result.getString("name");
					String user_surname = result.getString("surname");
					User user = new User(email, user_name, user_surname);
					return user;
				}
			}
		}
	}
	
	public void createUser(String email, String password, String name, String surname) throws SQLException {
		String query = "INSERT INTO user VALUES (?, ?, ?, ?)";
		
		try (PreparedStatement pstatement = connection.prepareStatement(query)) {
			pstatement.setString(1, email);
			pstatement.setString(2, password);
			pstatement.setString(3, name);
			pstatement.setString(4, surname);
			
			pstatement.executeUpdate();
		}
	}
	
	public boolean checkNewEmail(String email) throws SQLException {
		String query = "SELECT email FROM user where email = ?";
		
		try(PreparedStatement pstatement = connection.prepareStatement(query)) {
			pstatement.setString(1, email);
			try (ResultSet result = pstatement.executeQuery()) {
				if (!result.isBeforeFirst()) return true; // no user with the same email in the db
				return false;
			}
		}
	}
	
}
