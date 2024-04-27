package controllers;

import java.sql.Connection;
import java.sql.Date;
import java.sql.SQLException;
import java.time.LocalDate;
import java.io.IOException;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;

import com.google.gson.Gson;
import com.google.gson.GsonBuilder;

import javax.servlet.http.HttpServletResponse;
import utils.ConnectionHandler;
import beans.User;
import beans.Group;
import dao.GroupDAO;

@WebServlet("/CreateGroup")
public class CreateGroup extends HttpServlet {
	private static final long serialVersionUID = 1L;
	private Connection connection = null;
       
    public CreateGroup() {
        super();
    }
    
    public void init() throws ServletException {
		connection = ConnectionHandler.getConnection(getServletContext());
	}

	protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		
	}

	protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		Group group = null;
		String title = null;
		Integer duration = null;
		int min_participants;
		int max_participants;
		
		try {
			title = request.getParameter("title");
			duration = Integer.parseInt(request.getParameter("duration"));
			max_participants = Integer.parseInt(request.getParameter("max_participants"));
			min_participants = Integer.parseInt(request.getParameter("min_participants"));
			
			if(min_participants > max_participants) {
				response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
				response.getWriter().println("Incorrect param values");
				return;
			}
		} catch(NumberFormatException | NullPointerException e) {
			response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
			response.getWriter().write("Incorrect or missing param values");
			return;
		}
		
		GroupDAO gDao = new GroupDAO(connection);
		LocalDate today = LocalDate.now();	
		Date creation_date = Date.valueOf(today); 
		int group_id;

		try {
			group_id = gDao.createGroup(title, creation_date, duration, min_participants, max_participants);

			// return to the app the new group id
			Gson gson = new GsonBuilder().setDateFormat("yyyy MMM dd").create();
			response.setContentType("application/json");
			response.setCharacterEncoding("UTF-8");

			String group_id_json = gson.toJson(group_id);
			response.getWriter().write(group_id_json);
			
		} catch (SQLException e) {
			response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
			response.getWriter().write("Not possible to create the group");
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
