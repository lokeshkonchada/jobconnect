package com.jobconnect.dto;

import com.jobconnect.entity.Application;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class StatusUpdateRequest {
    private Application.Status status;
}