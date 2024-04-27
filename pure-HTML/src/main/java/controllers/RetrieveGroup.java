package controllers;

import java.io.IOException;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import java.text.ParseException;
import java.sql.Connection;
import java.sql.SQLException;
import java.util.ArrayList;
import utils.ConnectionHandler;
import javax.servlet.ServletContext;
import org.thymeleaf.templateresolver.ServletContextTemplateResolver;

import beans.User;
import beans.Group;
import dao.GroupDAO;
import dao.UserDAO;

import org.thymeleaf.TemplateEngine;
import org.thymeleaf.context.WebContext;
import org.thymeleaf.templatemode.TemplateMode;

/**
 * Servlet implementation class RetrieveGroup
 */
@WebServlet("/RetrieveGroup")
public class RetrieveGroup extends HttpServlet {
	private static final long serialVersionUID = 1L;
	private Connection connection = null;
	private TemplateEngine templateEngine;
       
    public RetrieveGroup() {
        super();
    }
    
    public void init() throws ServletException {
		ServletContext servletContext = getServletContext();
		connection = ConnectionHandler.getConnection(servletContext);
		ServletContextTemplateResolver templateResolver = new ServletContextTemplateResolver(servletContext);
		templateResolver.setTemplateMode(TemplateMode.HTML);
		this.templateEngine = new TemplateEngine();
		this.templateEngine.setTemplateResolver(templateResolver);
		templateResolver.setSuffix(".html");
	}

	protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		doPost(request, response);
	}

	protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		String loginpath = getServletContext().getContextPath() + "/index.html";
		User u = null;
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
		} catch(Exception e) {
			response.sendError(HttpServletResponse.SC_BAD_REQUEST, "Missing parameter");
			return;
		}
		
		GroupDAO gDao = new GroupDAO(connection);
		Group group = null;
		
		UserDAO uDao = new UserDAO(connection);
		ArrayList<User> participants = null;
		
		try {
			group = gDao.getGroup(groupId);
		} catch (SQLException | ParseException e) {
			response.sendError(HttpServletResponse.SC_INTERNAL_SERVER_ERROR, "Failure in database extraction");
			return;
		}

		try {
			participants = uDao.getGroupParticipants(groupId);
			User creator = uDao.getCreator(groupId);
			if (participants == null) {
				if (creator != null) {
					participants = new ArrayList<>();
					participants.add(creator);
				}
			} else {
				participants.add(creator);
			}
		} catch (SQLException e) {
			response.sendError(HttpServletResponse.SC_INTERNAL_SERVER_ERROR, "Failure in database extraction");
			return;
		}
		
		s.removeAttribute("errors");
	
		if (group != null && participants != null && participants.contains(u)) {
			String path = "WEB-INF/GroupDetails.html";
			ServletContext servletContext = getServletContext();
			final WebContext ctx = new WebContext(request, response, servletContext, request.getLocale());
			ctx.setVariable("group", group);
			ctx.setVariable("participants", participants);
			templateEngine.process(path, ctx, response.getWriter());
		} else {
			String path = getServletContext().getContextPath() + "/Homepage";
			response.sendRedirect(path);
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
