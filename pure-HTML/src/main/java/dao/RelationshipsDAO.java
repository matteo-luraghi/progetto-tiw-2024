package dao;

import java.sql.Connection;  
import java.sql.PreparedStatement;
import java.sql.SQLException;

public class RelationshipsDAO {
	private Connection connection = null;
	
	public RelationshipsDAO(Connection connection) {
		this.connection = connection;
	}
	
	public void setCreated(int user_id, int group_id) throws SQLException {
		String query = "INSERT INTO created (user_id, group_id) VALUES (?, ?)";
		
		try(PreparedStatement pstatement = connection.prepareStatement(query)) {
			pstatement.setString(1,	Integer.toString(user_id));
			pstatement.setString(2, Integer.toString(group_id));
			
			pstatement.executeUpdate();
		} 
	}
	
	public void setContains(int user_id, int group_id) throws SQLException {
		String query = "INSERT INTO contains (user_id, group_id) VALUES (?, ?)";
		
		try(PreparedStatement pstatement = connection.prepareStatement(query)) {
			pstatement.setString(1,	Integer.toString(user_id));
			pstatement.setString(2, Integer.toString(group_id));
			
			pstatement.executeUpdate();
		}
	}

}
