package controllers;


import java.sql.Connection;
import java.io.IOException;
import java.sql.SQLException;
import java.util.ArrayList;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import utils.ConnectionHandler;
import beans.User;
import dao.RelationshipsDAO;
import dao.UserDAO;

@WebServlet("/SetGroupParticipants")
public class SetGroupParticipants extends HttpServlet {
	private static final long serialVersionUID = 1L;
	private Connection connection = null;
       
    public SetGroupParticipants() {
        super();
    }

	public void init() throws ServletException {
		connection = ConnectionHandler.getConnection(getServletContext());
	}
    
	protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {

	}

	protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		String loginpath = getServletContext().getContextPath();
		User u = null;
		int group_id = -1;
		HttpSession s = request.getSession();
		if (s.isNew() || s.getAttribute("user") == null) {
			response.sendRedirect(loginpath);
			return;
		} else {
			u = (User) s.getAttribute("user");
		}

		Integer groupId = null;
		try {
			groupId = Integer.parseInt(request.getParameter("groupId"));
		} catch(NumberFormatException e) {
			response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
			response.getWriter().println("Invalid parameter");
			return;
		}
		
		String[] users = request.getParameterValues("selected"); 
		
		if (users == null) { // 0 users selected
			users = new String[0];
		}
		
		UserDAO uDao = new UserDAO(connection);
		ArrayList<User> selectedUsers = new ArrayList<>();

		try {
			for(String userId: users) {
				try {
					selectedUsers.add(uDao.getUser(Integer.parseInt(userId)));
				} catch (NumberFormatException e) {
					response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
					response.getWriter().println("Invalid parameters");
					return;
				}
			}	
		} catch (SQLException e) {
			response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
			response.getWriter().println("Failure in database extraction");
			return;
		}
		
		RelationshipsDAO rel = new RelationshipsDAO(connection);
		
		try {
			// save the group creator
			rel.setCreated(u.getId(), group_id);
			// save the group participants
			for(User user: selectedUsers) {
				rel.setContains(user.getId(), group_id);
			}	
		} catch (SQLException e) {
			response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
			response.getWriter().println("Failure in update of the database");
			return;
		}

	}
	
	
	public void destroy() {
		try {
			ConnectionHandler.closeConnection(connection);
		} catch (SQLException e) {
			e.printStackTrace();
		}
	}

}
